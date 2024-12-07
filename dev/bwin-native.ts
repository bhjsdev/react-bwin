import { BinaryWindow, BUILTIN_ACTIONS } from 'bwin'

const settings: ConfigRoot = {
	width: 444,
	height: 333,
	children: [
		{
			size: 0.4,
			content: 'Hello world',
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
				{ size: 0.5, position: 'top', title: 'bye world' },
				{ title: '<mark>no drag</mark>', draggable: false },
			],
		},
	],
}
const bwin = new BinaryWindow(settings)
bwin.mount(document.getElementById('native-container')!)
