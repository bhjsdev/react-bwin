import React from 'react'
import { Window, WindowProvider, useWindow } from '../src'

// Exercises useWindow().setDetachedGlassBaseZIndex. The manager is a shared
// singleton, so setting the base affects the NEXT glass raised, not existing ones:
// set a large base, then add a glass and watch it jump above the earlier ones.
export default function App() {
  return (
    <WindowProvider>
      <Main />
    </WindowProvider>
  )
}

function Main() {
  const { addDetachedGlass, setDetachedGlassBaseZIndex } = useWindow()
  const counter = React.useRef(0)
  const [baseZIndex, setBaseZIndex] = React.useState(1)

  async function handleAdd() {
    const n = ++counter.current
    await addDetachedGlass({
      title: `Detached ${n}`,
      content: (
        <div style={{ padding: 8 }}>
          detached {n} — inspect z-index in devtools
        </div>
      ),
    })
  }

  function handleSetBase() {
    setDetachedGlassBaseZIndex(baseZIndex)
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Detached glass base z-index via useWindow</h2>
      <div style={{ marginBottom: 12 }}>
        <label>
          base z-index{' '}
          <input
            type="number"
            value={baseZIndex}
            onChange={(e) => setBaseZIndex(Number(e.target.value))}
          />
        </label>
        <button onClick={handleSetBase}>Set base z-index</button>
        <button onClick={handleAdd}>Add detached</button>
      </div>
      <Window
        width={555}
        height={333}
        panes={[
          {
            size: 0.5,
            position: 'left',
            title: 'Pane 1',
            content: (
              <div style={{ padding: 8 }}>
                Add a few glasses, set a large base, then add another.
              </div>
            ),
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
