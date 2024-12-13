import React, { useState, useMemo, useEffect, useRef } from 'react'
import { Window } from '../src'

export default function App() {
  const windowRef = useRef<WindowRef>(null)

  useEffect(() => {
    console.log(windowRef.current)
  }, [])

  return (
    <div style={{ padding: 20, width: 800, height: 400 }}>
      <Window ref={windowRef} />
    </div>
  )
}
