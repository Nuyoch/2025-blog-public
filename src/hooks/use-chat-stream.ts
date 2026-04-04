import { useState, useCallback, useRef } from 'react'
import type { ChatMessage } from '@/types/chat'

export function useChatStream() {
	const [messages, setMessages] = useState<ChatMessage[]>([])
	const [isStreaming, setIsStreaming] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const abortControllerRef = useRef<AbortController | null>(null)

	const sendMessage = useCallback(async (content: string) => {
		if (!content.trim() || isStreaming) return

		const userMessage: ChatMessage = {
			id: crypto.randomUUID(),
			role: 'user',
			content: content.trim(),
			timestamp: Date.now(),
		}

		const assistantMessage: ChatMessage = {
			id: crypto.randomUUID(),
			role: 'assistant',
			content: '',
			timestamp: Date.now(),
		}

		setMessages(prev => [...prev, userMessage, assistantMessage])
		setIsStreaming(true)
		setError(null)

		const abortController = new AbortController()
		abortControllerRef.current = abortController

		try {
			const apiMessages = [...messages, userMessage].map(m => ({
				role: m.role,
				content: m.content,
			}))

			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ messages: apiMessages }),
				signal: abortController.signal,
			})

			if (!response.ok) {
				const errData = await response.json()
				throw new Error(errData.error || `HTTP ${response.status}`)
			}

			// 检查响应类型，处理非流式 JSON 响应
			const responseContentType = response.headers.get('content-type') || ''

			if (responseContentType.includes('application/json')) {
				const data = await response.json()
				const c = data.choices?.[0]?.message?.content
					|| data.choices?.[0]?.delta?.content
					|| data.content
					|| ''

				if (c) {
					setMessages(prev =>
						prev.map(m =>
							m.id === assistantMessage.id
								? { ...m, content: c }
								: m
						)
					)
				} else {
					console.warn('[useChatStream] JSON 响应中未找到内容:', data)
				}
				return
			}

			// SSE 流式响应
			const reader = response.body?.getReader()
			if (!reader) throw new Error('无法获取响应流')

			const decoder = new TextDecoder()
			let buffer = ''
			let receivedChunks = 0
			let rawLog = ''

			while (true) {
				const { done, value } = await reader.read()
				if (done) break

				buffer += decoder.decode(value, { stream: true })

				// 统一处理 \r\n 和 \n 行尾
				const lines = buffer.split(/\r?\n/)
				buffer = lines.pop() || ''

				for (const line of lines) {
					const trimmed = line.trim()
					if (!trimmed) continue

					// 收集前 500 字符原始数据用于调试
					if (rawLog.length < 500) {
						rawLog += trimmed + '\n'
					}

					// 兼容 "data: {...}" 和 "data:{...}" 两种格式
					if (!trimmed.startsWith('data:')) continue
					const data = trimmed.startsWith('data: ')
						? trimmed.slice(6)
						: trimmed.slice(5)
					if (data === '[DONE]') continue

					try {
						const parsed = JSON.parse(data)
						const delta = parsed.choices?.[0]?.delta?.content
						if (delta) {
							receivedChunks++
							setMessages(prev =>
								prev.map(m =>
									m.id === assistantMessage.id
										? { ...m, content: m.content + delta }
										: m
								)
							)
						}
					} catch (e) {
						console.warn('[useChatStream] 无法解析 SSE 行:', trimmed, e)
					}
				}
			}

			if (receivedChunks === 0) {
				console.error('[useChatStream] SSE 流结束但未收到任何内容 chunk。原始数据:\n', rawLog)
			}
		} catch (err) {
			if (err instanceof Error && err.name === 'AbortError') {
				// 用户主动取消，不报错
			} else {
				console.error('[useChatStream] 请求失败:', err)
				setError(err instanceof Error ? err.message : '未知错误')
			}
		} finally {
			setIsStreaming(false)
			abortControllerRef.current = null
		}
	}, [messages, isStreaming])

	const stopStreaming = useCallback(() => {
		abortControllerRef.current?.abort()
	}, [])

	const clearMessages = useCallback(() => {
		setMessages([])
		setError(null)
	}, [])

	return { messages, isStreaming, error, sendMessage, stopStreaming, clearMessages }
}
