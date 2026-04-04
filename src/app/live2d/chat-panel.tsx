'use client'

import { useRef, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Send, X, Trash2 } from 'lucide-react'
import { useChatStream } from '@/hooks/use-chat-stream'
import { ChatMessageItem } from './chat-message'

interface ChatPanelProps {
	isOpen: boolean
	onClose: () => void
}

export default function ChatPanel({ isOpen, onClose }: ChatPanelProps) {
	const { messages, isStreaming, error, sendMessage, stopStreaming, clearMessages } = useChatStream()
	const [input, setInput] = useState('')
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const inputRef = useRef<HTMLTextAreaElement>(null)

	// 自动滚动到底部
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	// 面板打开时聚焦输入框
	useEffect(() => {
		if (isOpen) {
			setTimeout(() => inputRef.current?.focus(), 300)
		}
	}, [isOpen])

	const handleSubmit = () => {
		if (!input.trim() || isStreaming) return
		sendMessage(input)
		setInput('')
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSubmit()
		}
	}

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ x: '100%', opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					exit={{ x: '100%', opacity: 0 }}
					transition={{ type: 'spring', damping: 25, stiffness: 300 }}
					className='fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-white/20 bg-[#f8faf9]/95 backdrop-blur-xl'
				>
					{/* 头部 */}
					<div className='flex items-center justify-between border-b border-white/20 px-4 py-3'>
						<div className='flex items-center gap-2'>
							{/* <img src='/images/avatar.png' alt='纳西妲' className='h-6 w-6 rounded-full object-cover' /> */}
							<div>
								<h3 className='text-sm font-semibold text-gray-800'>纳西妲</h3>
								<p className='text-xs text-gray-500'>须弥草神 · 布耶尔</p>
							</div>
						</div>
						<div className='flex items-center gap-1'>
							<button
								onClick={clearMessages}
								className='rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600'
								title='清空对话'
							>
								<Trash2 size={16} />
							</button>
							<button
								onClick={onClose}
								className='rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600'
								title='关闭'
							>
								<X size={16} />
							</button>
						</div>
					</div>

					{/* 消息列表 */}
					<div className='flex-1 overflow-y-auto px-4 py-4'>
						{messages.length === 0 && (
							<div className='flex h-full flex-col items-center justify-center text-center'>
								<span className='mb-3 text-4xl'>🌱</span>
								<p className='text-sm text-gray-500'>
									点击纳西妲开始对话
								</p>
								<p className='mt-1 text-xs text-gray-400'>
									她是须弥的草神，智慧的化身
								</p>
							</div>
						)}
						{messages.map(msg => (
							<ChatMessageItem key={msg.id} message={msg} />
						))}
						{isStreaming && (
							<div className='mb-3 flex justify-start'>
								<div className='mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#35bfab]/20 text-sm'>
									
								</div>
								<div className='rounded-2xl rounded-bl-md bg-white/80 px-4 py-2.5 backdrop-blur-sm'>
									<div className='flex gap-1'>
										<span className='h-2 w-2 animate-bounce rounded-full bg-[#35bfab]' style={{ animationDelay: '0ms' }} />
										<span className='h-2 w-2 animate-bounce rounded-full bg-[#35bfab]' style={{ animationDelay: '150ms' }} />
										<span className='h-2 w-2 animate-bounce rounded-full bg-[#35bfab]' style={{ animationDelay: '300ms' }} />
									</div>
								</div>
							</div>
						)}
						{error && (
							<div className='rounded-lg bg-red-50 px-3 py-2 text-center text-xs text-red-500'>
								{error}
							</div>
						)}
						<div ref={messagesEndRef} />
					</div>

					{/* 输入区域 */}
					<div className='border-t border-white/20 p-3'>
						<div className='flex items-end gap-2 rounded-2xl bg-white/80 px-3 py-2 backdrop-blur-sm'>
							<textarea
								ref={inputRef}
								value={input}
								onChange={e => setInput(e.target.value)}
								onKeyDown={handleKeyDown}
								placeholder='和纳西妲说些什么...'
								rows={1}
								className='max-h-32 min-h-[36px] flex-1 resize-none bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none'
							/>
							{isStreaming ? (
								<button
									onClick={stopStreaming}
									className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-400 text-white transition-colors hover:bg-red-500'
									title='停止生成'
								>
									<X size={14} />
								</button>
							) : (
								<button
									onClick={handleSubmit}
									disabled={!input.trim()}
									className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#35bfab] text-white transition-colors hover:bg-[#2da89a] disabled:opacity-40 disabled:hover:bg-[#35bfab]'
									title='发送'
								>
									<Send size={14} />
								</button>
							)}
						</div>
						<p className='mt-1.5 text-center text-[10px] text-gray-400'>
							纳西妲可能会犯错，请核实重要信息
						</p>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
