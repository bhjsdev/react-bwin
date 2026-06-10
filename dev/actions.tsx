import React from 'react'
import {
  Window,
  DEFAULT_GLASS_ACTIONS,
  DEFAULT_DETACHED_GLASS_ACTIONS,
} from '../src'


export default function App() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Actions</h2>
      <Window
        id="root"
        width={444}
        height={333}
        actions={[DEFAULT_GLASS_ACTIONS[0], DEFAULT_GLASS_ACTIONS[2]]}
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
