import { memo } from 'react'
import { marked } from 'marked'
import type { ChatMessage as ChatMessageType } from '@/types/chat'

interface ChatMessageProps {
	message: ChatMessageType
}

function ChatMessageComponent({ message }: ChatMessageProps) {
	const isUser = message.role === 'user'

	const htmlContent = isUser
		? message.content
		: marked.parse(message.content, { async: false }) as string

	return (
		<div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
			{!isUser && (
				<div className='mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full'>
					<img src='/images/avatar.png' alt='纳西妲' className='h-8 w-8 rounded-full object-cover' />
				</div>
			)}
			<div
				className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
					isUser
						? 'bg-[#35bfab] text-white rounded-br-md'
						: 'bg-white/80 text-gray-800 rounded-bl-md backdrop-blur-sm'
				}`}
			>
				{isUser ? (
					<p className='whitespace-pre-wrap'>{message.content}</p>
				) : (
					<div
						className='prose prose-sm prose-neutral max-w-none [&_p]:mb-1 [&_p]:last:mb-0 [&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_pre]:rounded-lg [&_pre]:bg-gray-50 [&_pre]:p-2 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0.5'
						dangerouslySetInnerHTML={{ __html: htmlContent }}
					/>
				)}
			</div>
		</div>
	)
}

export const ChatMessageItem = memo(ChatMessageComponent)
