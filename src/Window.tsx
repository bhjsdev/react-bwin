import React, { useRef, useEffect } from 'react'
import { BinaryWindow } from 'bwin'
import Muntin from './Muntin.tsx'
import Pane from './Pane.tsx'
import 'bwin/bwin.css'

export default function Window(props: WindowProps) {
	const windowRef = useRef<HTMLElement>()
	const sillRef = useRef<HTMLElement>()

	const { panes: panesProp, ...restProps } = props
	const settings = { ...restProps, children: panesProp }

	const bwin = new BinaryWindow(settings)
	const muntins: Sash[] = []
	const panes: Sash[] = []

	bwin.rootSash.walk((sash: Sash) => {
		if (sash.children.length > 0) {
			muntins.push(sash)
		} else {
			panes.push(sash)
		}
	})

	useEffect(() => {
		const windowEl = windowRef.current

		if (windowEl?.parentElement) {
			bwin.windowElement = windowEl
			bwin.containerElement = windowEl.parentElement
			bwin.sillElement = sillRef.current!
			bwin.enableFeatures()
		}
	}, [])

	return (
		<bw-window
			sash-id={bwin.rootSash.id}
			style={{ width: bwin.rootSash.width, height: bwin.rootSash.height }}
			ref={windowRef}
		>
			{panes.map((sash) => (
				<Pane key={sash.id} sash={sash} bwin={bwin} />
			))}
			{muntins.map((sash) => (
				<Muntin key={sash.id} sash={sash} />
			))}
			<bw-sill ref={sillRef} />
		</bw-window>
	)
}
