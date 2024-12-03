import { createRoot } from 'react-dom/client'
import Window from '../src/Window'
import Counter from './Counter'

function App() {
	return (
		<div id="bwin-container" style={{ width: 400, height: 300, backgroundColor: 'pink' }}>
			<Window
				id="root"
				width={333}
				height={222}
				fitContainer={false}
				content={<em>Root!</em>}
				children={[
					{ size: 0.4, content: 'hello world', actions: null },
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

createRoot(document.getElementById('root')!).render(<App />)
