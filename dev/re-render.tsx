import React, { useState } from 'react'
import { Window } from '../src'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ padding: 20 }}>
      <p>
        If Window internally not memoized, then after click, it will throw error
        when hit X button to close the pane
      </p>
      <button onClick={() => setCount((count) => count + 1)}>
        Click to trigger re-render, count is {count}
      </button>
      <Window
        width={444}
        height={333}
        panes={[
          {
            size: 0.4,
          },
        ]}
      />
    </div>
  )
}
