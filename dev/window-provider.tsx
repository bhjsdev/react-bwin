import React from 'react'
import { Window, WindowProvider, useWindow } from '../src'

export default function App() {
  return (
    <WindowProvider>
      <Main />
    </WindowProvider>
  )
}

function Main() {
  const { addPane, removePane, updatePane, fit, setTheme } = useWindow()

  React.useEffect(() => {
    setTheme('dark')
  })

  function handlePaneAdd() {
    addPane('a', {
      position: 'right',
      size: 0.3,
      title: 'New title',
      content: <i>New content</i>,
    })
  }

  function handlePaneRemove() {
    removePane('a')
  }

  function handlePaneUpdate() {
    updatePane('a', {
      content: <mark>Updated with a React component</mark>,
    })
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Window Provider</h2>
      <button onClick={handlePaneAdd}>Add pane</button>
      <button onClick={handlePaneRemove}>Remove pane</button>
      <button onClick={handlePaneUpdate}>Update pane</button>
      <button onClick={() => fit()}>Fit</button>
      <button onClick={() => setTheme('light')}>Light theme</button>
      <Window
        id="root"
        width={444}
        height={333}
        panes={[
          {
            size: 0.4,
            id: 'a',
            content: 'a',
          },
          {
            children: [
              {
                size: 0.5,
                position: 'top',
                id: 'b',
                content: 'b',
              },
            ],
          },
        ]}
      />
    </div>
  )
}
