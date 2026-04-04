import { NextRequest } from 'next/server'
import { NAHIDA_SYSTEM_PROMPT } from '@/config/nahida-persona'

export async function POST(req: NextRequest) {
	try {
		const { messages } = await req.json()

		const baseUrl = process.env.LLM_BASE_URL
		const apiKey = process.env.LLM_API_KEY
		const model = process.env.LLM_MODEL || 'gpt-4o-mini'

		if (!baseUrl || !apiKey) {
			return new Response(
				JSON.stringify({ error: 'LLM API 未配置，请设置环境变量 LLM_BASE_URL 和 LLM_API_KEY' }),
				{ status: 500, headers: { 'Content-Type': 'application/json' } }
			)
		}

		const requestBody = {
			model,
			messages: [
				{ role: 'system', content: NAHIDA_SYSTEM_PROMPT },
				...messages
			],
			stream: true,
		}

		const response = await fetch(`${baseUrl}/chat/completions`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${apiKey}`,
			},
			body: JSON.stringify(requestBody),
		})

		if (!response.ok) {
			const errorText = await response.text()
			return new Response(
				JSON.stringify({ error: `LLM API 错误: ${response.status} - ${errorText}` }),
				{ status: response.status, headers: { 'Content-Type': 'application/json' } }
			)
		}

		const contentType = response.headers.get('content-type') || ''

		// 如果 API 返回的是 JSON 而非 SSE 流，手动转换为 SSE 格式
		if (contentType.includes('application/json')) {
			const data = await response.json()
			const content = data.choices?.[0]?.message?.content || ''

			// 构造 SSE 格式响应
			const ssePayload = `data: ${JSON.stringify({
				id: data.id || 'chatcmpl-local',
				object: 'chat.completion.chunk',
				choices: [{
					index: 0,
					delta: { content },
					finish_reason: 'stop',
				}],
			})}\n\ndata: [DONE]\n\n`

			return new Response(ssePayload, {
				headers: {
					'Content-Type': 'text/event-stream',
					'Cache-Control': 'no-cache',
					'Connection': 'keep-alive',
				},
			})
		}

		// 标准 SSE 流，直接透传
		return new Response(response.body, {
			headers: {
				'Content-Type': 'text/event-stream',
				'Cache-Control': 'no-cache',
				'Connection': 'keep-alive',
			},
		})
	} catch (error) {
		console.error('[/api/chat] 服务器错误:', error)
		return new Response(
			JSON.stringify({ error: '服务器内部错误' }),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		)
	}
}
