import React from 'react'
import ReactDOM from 'react-dom'
import { Window, BUILTIN_ACTIONS } from '../src'
import Counter from './Counter'

function App() {
	return (
		<div
			id="react-container"
			style={{ width: 400, height: 400, backgroundColor: 'pink' }}
		>
			<Window
				id="root"
				width={444}
				height={333}
				fitContainer={false}
				content={<em>Root!</em>}
				children={[
					{
						size: 0.4,
						content: 'hello world',
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
		</div>
	)
}

ReactDOM.render(<App />, document.getElementById('react-root'))
