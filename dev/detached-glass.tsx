import React from 'react'
import { Window, WindowProvider, useWindow } from '../src'

// Programmatic in-window detached glass via useWindow (mirrors the ☐ action, but
// driven from React with portaled content). A detached glass floats INSIDE the
// bw-window, unlike a windowless glass which floats on document.body.
export default function App() {
  return (
    <WindowProvider>
      <Main />
    </WindowProvider>
  )
}

function Main() {
  const { addDetachedGlass, removeDetachedGlass } = useWindow()
  const counter = React.useRef(0)
  const lastIdRef = React.useRef<string | null>(null)

  // No position/size: cascades down-right of the active detached glass.
  async function handleAdd() {
    const n = ++counter.current
    const glassEl = await addDetachedGlass({
      title: `Detached ${n}`,
      content: <div style={{ padding: 8 }}>detached {n}</div>,
    })
    lastIdRef.current = glassEl.id
  }

  // Anchored to the window's top-left via offsetX/offsetY.
  async function handleAddPositioned() {
    const n = ++counter.current
    const glassEl = await addDetachedGlass({
      title: `Positioned ${n}`,
      position: 'top-left',
      offsetX: 40,
      offsetY: 40,
      content: <div style={{ padding: 8 }}>positioned {n}</div>,
    })
    lastIdRef.current = glassEl.id
  }

  // Fixed size with resize handles suppressed.
  async function handleAddNonResizable() {
    const n = ++counter.current
    const glassEl = await addDetachedGlass({
      title: `Non-resizable ${n}`,
      width: 260,
      height: 160,
      resizable: false,
      content: <div style={{ padding: 8 }}>non-resizable {n}</div>,
    })
    lastIdRef.current = glassEl.id
  }

  function handleRemoveLast() {
    if (lastIdRef.current) {
      removeDetachedGlass(lastIdRef.current)
      lastIdRef.current = null
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Detached glass via useWindow</h2>
      <div style={{ marginBottom: 12 }}>
        <button onClick={handleAdd}>Add detached</button>
        <button onClick={handleAddPositioned}>Add positioned</button>
        <button onClick={handleAddNonResizable}>Add non-resizable</button>
        <button onClick={handleRemoveLast}>Remove last</button>
      </div>
      <Window
        width={555}
        height={333}
        panes={[
          {
            size: 0.5,
            position: 'left',
            title: 'Pane 1',
            content: <div style={{ padding: 8 }}>Add a detached glass above</div>,
          },
          {
            title: 'Pane 2',
            content: <div style={{ padding: 8 }}>Detach me with ☐ too</div>,
          },
        ]}
      />
    </div>
  )
}
