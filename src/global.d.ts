declare module 'bwin' {
	export const BUILTIN_ACTIONS: []
	export const BinaryWindow: BinaryWindow
}

declare namespace JSX {
	interface IntrinsicElements {
		'bw-window': React.DetailedHTMLProps<any, HTMLElement>
		'bw-pane': React.DetailedHTMLProps<any, HTMLElement>
		'bw-muntin': React.DetailedHTMLProps<any, HTMLElement>
		'bw-glass': React.DetailedHTMLProps<any, HTMLElement>
		'bw-glass-header': React.DetailedHTMLProps<any, HTMLElement>
		'bw-glass-title': React.DetailedHTMLProps<any, HTMLElement>
		'bw-glass-action-container': React.DetailedHTMLProps<any, HTMLElement>
		'bw-glass-content': React.DetailedHTMLProps<any, HTMLElement>
	}
}

type Position = 'left' | 'right' | 'top' | 'bottom'

type Action = {
	label?: string
	className?: string
	onClick: (
		event: React.MouseEvent<HTMLButtonElement>,
		bwin: BinaryWindow
	) => void
}

type Actions = undefined | null | Action[]

interface Sash {
	id: string
	position: Position
	left: number
	top: number
	width: number
	height: number
	children: Sash[]
	domNode?: HTMLElement
	leftChild?: Sash
	rightChild?: Sash
	topChild?: Sash
	bottomChild?: Sash
	store?: {
		actions?: Actions
		droppable?: boolean
		draggable?: boolean
		title?: any
		content?: any
		resizable?: boolean
	}
	walk(callback: (sash: Sash) => void): void
}

type ConfigNode = {
	id?: string
	size?: number
	position?: Position
	title?: ReactNode
	content?: ReactNode
	actions?: Actions
	children?: ConfigNode[]
	draggable?: boolean
	droppable?: boolean
}

type ConfigRoot = {
	id?: string
	width?: number
	height?: number
	fitContainer?: boolean
	title?: ReactNode
	content?: ReactNode
	children?: ConfigNode[]
}

interface BinaryWindow {
	new (settings: ConfigRoot): BinaryWindow
	rootSash: Sash
	windowElement: HTMLElement
	containerElement: HTMLElement
	mount(container: HTMLElement): void
	enableFeatures(): void
}

type WindowProps = ConfigRoot
