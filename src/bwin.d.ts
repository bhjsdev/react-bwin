declare module 'bwin' {
	export const BUILTIN_ACTIONS: Action[]
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
