import React, { useState, useMemo, useEffect, useRef } from 'react'
import { Window } from '../src'

export default function App() {
  const windowRef = useRef<WindowRef>(null)

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => windowRef.current?.binaryWindow.fit()}>Fit</button>
      <div style={{ width: 800, height: 400, backgroundColor: 'pink' }}>
        <Window
          ref={windowRef}
          id="root"
          width={444}
          height={333}
          fitContainer={false}
          content={<em>Root!</em>}
          panes={[
            {
              size: 0.4,
            },
            {
              children: [
                {
                  id: 'top-right',
                  size: 0.5,
                  position: 'top',
                },
                {
                  id: 'bottom-right',
                },
              ],
            },
          ]}
        />
      </div>
    </div>
  )
}
