'use client'

import { useEffect, useRef, useState } from 'react'
import { live2dDialogs } from '@/config/live2d-dialogs'

/** PIXI Application 实例（CDN 加载，无类型包） */
interface PixiAppInstance {
	stage: { addChild: (child: unknown) => void }
	view: HTMLCanvasElement
	destroy: (opts?: { removeView?: boolean }) => void
}

/** Live2D 模型实例 */
interface Live2DModelInstance {
	anchor: { set: (x: number, y: number) => void }
	x: number
	y: number
	scale: { set: (x: number, y: number) => void }
}

const CDN_SCRIPTS = [
	'https://cdnjs.cloudflare.com/ajax/libs/pixi.js/6.2.0/browser/pixi.min.js',
	'https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js',
	'https://cdn.jsdelivr.net/npm/pixi-live2d-display/dist/cubism4.min.js'
]

const MODEL_URL = '/live2d/Nahida_1080/Nahida_1080.model3.json'

function loadScript(src: string): Promise<void> {
	return new Promise((resolve, reject) => {
		if (document.querySelector(`script[src="${src}"]`)) {
			resolve()
			return
		}
		const script = document.createElement('script')
		script.src = src
		script.crossOrigin = 'anonymous'
		script.onload = () => resolve()
		script.onerror = () => reject(new Error(`Failed to load script: ${src}`))
		document.head.appendChild(script)
	})
}

export default function Live2DViewer({ fixed = false, onModelClick }: { fixed?: boolean; onModelClick?: () => void }) {
	const containerRef = useRef<HTMLDivElement>(null)
	const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
	const [errorMsg, setErrorMsg] = useState<string>('')
	const [currentDialog, setCurrentDialog] = useState<string | null>(null)
	const [dialogIndex, setDialogIndex] = useState(0)

	const handleModelClick = () => {
		const dialog = live2dDialogs[dialogIndex]
		setCurrentDialog(dialog.text)
		setDialogIndex((prev) => (prev + 1) % live2dDialogs.length)

		setTimeout(() => {
			setCurrentDialog(null)
		}, 3000)

		onModelClick?.()
	}

	useEffect(() => {
		const container = containerRef.current
		if (!container) return

		let app: PixiAppInstance | null = null

		const init = async () => {
			try {
				for (const src of CDN_SCRIPTS) {
					await loadScript(src)
				}

				const PIXI = (window as unknown as { PIXI: unknown }).PIXI
				if (!PIXI) {
					throw new Error('PIXI not found on window')
				}
				;(window as unknown as { PIXI: unknown }).PIXI = PIXI

				const PIXIApp = (
					PIXI as { Application: new (opts: { view: HTMLCanvasElement; width?: number; height?: number; backgroundAlpha?: number }) => PixiAppInstance }
				).Application

				const Live2DModel = (PIXI as { live2d?: { Live2DModel: { from: (url: string) => Promise<Live2DModelInstance> } } }).live2d?.Live2DModel

				if (!Live2DModel) {
					throw new Error('PIXI.live2d.Live2DModel not found')
				}

				const width = container.clientWidth || 500
				const height = container.clientHeight || 500
				const canvas = document.createElement('canvas')
				canvas.style.width = '100%'
				canvas.style.height = '100%'
				canvas.style.display = 'block'
				container.appendChild(canvas)

				app = new PIXIApp({
					view: canvas,
					width,
					height,
					backgroundAlpha: 0
				})

				const model = await Live2DModel.from(MODEL_URL)
				app.stage.addChild(model)

				model.anchor.set(0.7, 1)
				model.x = width / 2
				model.y = height
				model.scale.set(fixed ? 0.08 : 0.12, fixed ? 0.08 : 0.12)

				setStatus('ready')
			} catch (err) {
				setErrorMsg(err instanceof Error ? err.message : String(err))
				setStatus('error')
			}
		}

		init()

		return () => {
			if (app !== null && typeof app === 'object' && 'destroy' in app && typeof app.destroy === 'function') {
				app.destroy({ removeView: true })
			}
			container.innerHTML = ''
		}
	}, [])

	return (
		<div className={fixed ? 'fixed bottom-4 left-4 z-40 h-100 w-100' : 'relative h-[800px] w-[800px]'}>
			<div ref={containerRef} className='absolute inset-0 h-full w-full' onClick={handleModelClick} />
			{status === 'loading' && <div className='text-secondary absolute inset-0 flex items-center justify-center text-xs'>加载中…</div>}
			{status === 'error' && <div className='absolute inset-0 flex items-center justify-center p-4 text-center text-xs text-red-500'>{errorMsg}</div>}
			{currentDialog && (
				<div className={`pointer-events-none absolute ${fixed ? 'left-1/2 left-[35%] top-[-7%]' : 'left-1/2 left-[40%] top-[20%]'} -translate-x-1/2 animate-fade-in`}>
					<div className='relative bg-white px-6 py-3 rounded-2xl shadow-lg'>
						<div className='absolute -bottom-2 left-1/2 -translate-x-1/2 h-0 w-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-white' />
						<p className='text-sm font-medium text-gray-800'>{currentDialog}</p>
					</div>
				</div>
			)}
		</div>
	)
}
