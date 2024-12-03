import React, { useRef, useEffect } from 'react'

const MUNTIN_SIZE = 4

export default function Muntin({ sash }: { sash: Sash }) {
	const muntinRef = useRef<HTMLElement>()

	const leftChild = sash.leftChild
	const topChild = sash.topChild
	let width, height, top, left, isVertical, isHorizontal

	if (leftChild) {
		width = MUNTIN_SIZE
		height = sash.height - MUNTIN_SIZE
		top = sash.top + MUNTIN_SIZE / 2
		left = sash.left + leftChild.width - MUNTIN_SIZE / 2
		isVertical = true
	} else if (topChild) {
		width = sash.width - MUNTIN_SIZE
		height = MUNTIN_SIZE
		top = sash.top + topChild.height - MUNTIN_SIZE / 2
		left = sash.left + MUNTIN_SIZE / 2
		isHorizontal = true
	}

	useEffect(() => {
		sash.domNode = muntinRef.current
	}, [])

	return (
		<bw-muntin
			sash-id={sash.id}
			style={{
				width,
				height,
				top,
				left,
			}}
			vertical={isVertical}
			horizontal={isHorizontal}
			resizable={sash.store?.resizable === false ? 'false' : 'true'}
			ref={muntinRef}
		></bw-muntin>
	)
}
