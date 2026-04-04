'use client'

import { useState } from 'react'
import Live2DViewer from './live2d-viewer'
import ChatPanel from './chat-panel'

export default function Live2DPage() {
	const [isChatOpen, setIsChatOpen] = useState(false)

	const handleModelClick = () => {
		setIsChatOpen(prev => !prev)
	}

	return (
		<div className='relative flex h-full items-center justify-center py-8'>
			<Live2DViewer onModelClick={handleModelClick} />
			<ChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
		</div>
	)
}
