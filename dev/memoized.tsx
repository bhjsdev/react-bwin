import React, { useState, useMemo } from 'react'
import { Window, BUILTIN_ACTIONS } from '../src'
import Counter from './Counter'
import { ContentProvider, useContentAPI } from './ContentContext'

function DynamicContent() {
	const { content } = useContentAPI()

	if (!content) {
		return <p>Default content</p>
	}
	return <p>{content}</p>
}

function Content() {
	const { updateContent } = useContentAPI()

	return (
		<button onClick={() => updateContent(<mark>xxx</mark>)}>
			Update Content
		</button>
	)
}

export default function App() {
	const [count, setCount] = useState(0)

	const windowNode = (
		<Window
			id="root"
			width={444}
			height={333}
			fitContainer={false}
			content={<em>Root!</em>}
			panes={[
				{
					size: 0.4,
					content: <DynamicContent />,
					actions: [
						{
							label: 'Update',
							onClick: (event, bwin) => {
								const glassEl = (event.target as HTMLButtonElement).closest(
									'bw-glass'
								) as HTMLElement
								const contentEl = glassEl.querySelector('bw-glass-content')

								if (contentEl) {
									contentEl.innerHTML = `Bye world ${bwin.rootSash.id}`
								}
							},
						},
						...BUILTIN_ACTIONS,
					],
				},
				{
					children: [
						{
							id: 'top-right',
							size: 0.5,
							position: 'top',
							title: 'bye world',
							content: <Counter />,
						},
						{
							id: 'bottom-right',
							title: <mark>no drag</mark>,
							draggable: false,
						},
					],
				},
			]}
		/>
	)

	const memoizedWindowNode = useMemo(() => windowNode, [])

	return (
		<div style={{ padding: 20 }}>
			<div
				id="react-container"
				style={{ width: 400, height: 400, backgroundColor: 'pink' }}
			>
				<button onClick={() => setCount((count) => count + 1)}>
					count is {count}
				</button>
				<ContentProvider>
					<Content />
					{memoizedWindowNode}
				</ContentProvider>
			</div>
		</div>
	)
}
