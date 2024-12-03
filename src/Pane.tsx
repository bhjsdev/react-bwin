import { useRef, useEffect } from 'react'
import { BUILTIN_ACTIONS } from 'bwin'

export default function Pane({
	sash,
	bwin,
}: {
	sash: Sash
	bwin: BinaryWindow
}) {
	const paneRef = useRef()
	const { left, top, width, height, id, position } = sash

	useEffect(() => {
		sash.domNode = paneRef.current
	}, [])

	const actions =
		sash.store?.actions === undefined
			? BUILTIN_ACTIONS
			: Array.isArray(sash.store.actions)
				? sash.store.actions
				: []

	return (
		<bw-pane
			sash-id={id}
			position={position}
			style={{ left, top, width, height }}
			can-drop={sash.store?.droppable === false ? 'false' : 'true'}
			ref={paneRef}
		>
			<bw-glass>
				<bw-glass-header
					can-drag={sash.store?.draggable === false ? 'false' : 'true'}
				>
					{sash.store?.title && (
						<bw-glass-title>{sash.store.title}</bw-glass-title>
					)}
					{actions.length > 0 && (
						<bw-glass-action-container>
							{actions.map((action: any, key: number) => {
								const className = action.className
									? `bw-glass-action ${action.className}`
									: 'bw-glass-action'

								return (
									<button
										className={className}
										key={key}
										onClick={(event) => action.onClick(event, bwin)}
									>
										{action.label}
									</button>
								)
							})}
						</bw-glass-action-container>
					)}
				</bw-glass-header>
				<bw-glass-content>{sash.store?.content}</bw-glass-content>
			</bw-glass>
		</bw-pane>
	)
}
