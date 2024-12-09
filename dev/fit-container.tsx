import React, { useState, useMemo, useEffect, useRef } from 'react'
import { Window } from '../src'

export default function App() {
	const windowRef = useRef<WindowRef>(null)

	const windowNode = (
		<Window
			ref={windowRef}
			id="root"
			width={444}
			height={333}
			fitContainer={true}
			content={<em>Root!</em>}
			panes={[
				{
					size: 0.4,
				},
				{
					children: [
						{
							id: 'top-right',
							size: 0.5,
							position: 'top',
						},
						{
							id: 'bottom-right',
						},
					],
				},
			]}
		/>
	)

	const memoizedWindowNode = useMemo(() => windowNode, [])

	useEffect(() => {
		console.log(windowRef.current)
	}, [])

	return (
		<div style={{ padding: 20, width: 800, height: 400 }}>
			{memoizedWindowNode}
		</div>
	)
}
