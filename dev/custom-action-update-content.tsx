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
  const { updatePane } = useWindow()

  function handleUpdate() {
    updatePane('a', {
      content: <mark>Updated with a React component</mark>,
    })
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Update pane content</h2>
      <button onClick={handleUpdate}>Update pane "a"</button>
      <Window
        width={555}
        height={333}
        panes={[
          {
            id: 'a',
            size: 0.5,
            title: 'Original title',
            content: <i>Click the button to update this pane</i>,
          },
          {
            id: 'b',
            title: 'Untouched',
            content: <i>This pane should stay the same</i>,
          },
        ]}
      />
    </div>
  )
}
