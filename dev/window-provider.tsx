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
  const { addPane } = useWindow()

  function handlePaneAdd() {
    addPane()
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Window Provider</h2>
      <button onClick={handlePaneAdd}>Add pane</button>
      <Window
        id="root"
        width={444}
        height={333}
        panes={[
          {
            size: 0.4,
          },
          {
            children: [
              {
                size: 0.5,
                position: 'top',
              },
            ],
          },
        ]}
      />
    </div>
  )
}
