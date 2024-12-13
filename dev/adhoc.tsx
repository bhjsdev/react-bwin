import React from 'react'
import { Window } from '../src'

export default function App() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Adhoc</h2>
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
