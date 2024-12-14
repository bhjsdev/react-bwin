import React, { useEffect, useRef, useState } from 'react'
import { Window } from '../src'

export default function App() {
  const windowRef = useRef<WindowHandle>(null)
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    windowRef.current?.addPane('b', {
      position: 'right',
      content: <i>Added in useEffect</i>,
    })
  }, [])

  function handlePaneAdd() {
    windowRef.current?.addPane(inputValue, {
      position: 'right',
      size: 0.3,
      title: 'New title',
      content: <i>New content</i>,
    })
  }

  function handlePaneRemove() {
    windowRef.current?.removePane(inputValue)
  }

  return (
    <>
      <h2>Add remove panes</h2>
      <input
        type="text"
        placeholder="Sash ID"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
      />
      <button onClick={handlePaneAdd}>Add pane</button>
      <button onClick={handlePaneRemove}>Remove pane</button>
      <div style={{ width: 800, height: 400 }}>
        <Window
          ref={windowRef}
          id="root"
          width={444}
          height={333}
          fitContainer={true}
          panes={[
            {
              size: 0.5,
              id: 'a',
              content: 'a',
            },
            {
              size: 0.5,
              children: [
                {
                  position: 'top',
                  size: 0.5,
                  id: 'b',
                  content: 'b',
                },
                {
                  size: 0.5,
                  id: 'c',
                  content: 'c',
                },
              ],
            },
          ]}
        />
      </div>
    </>
  )
}
