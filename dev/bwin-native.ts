import { BinaryWindow } from 'bwin'

const settings: ConfigRoot = {
	width: 333,
	height: 222,
	children: [
		{ size: 0.4, content: 'hello world', actions: [] },
		{
			children: [
				{ size: 0.5, position: 'top', title: 'bye world' },
				{ title: '<mark>no drag</mark>', draggable: false },
			],
		},
	],
}
const bwin = new BinaryWindow(settings)
bwin.mount(document.getElementById('container')!)
