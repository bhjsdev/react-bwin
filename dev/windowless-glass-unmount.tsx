import React from 'react'
import { Window, WindowProvider, useWindow } from '../src'

export default function App() {
  const [mounted, setMounted] = React.useState(true)

  return (
    <div style={{ padding: 20 }}>
      <h2>Detached glass — unmount cleanup</h2>
      <ol>
        <li>Open a windowless glass</li>
        <li>
          Without closing anything, untick <b>Mount WindowProvider</b>.
        </li>
        <li>
          Everything should disappear. Anything left on the page is an orphaned
          glass.
        </li>
      </ol>
      <label style={{ display: 'block', margin: '12px 0' }}>
        <input
          type="checkbox"
          checked={mounted}
          onChange={(e) => setMounted(e.target.checked)}
        />{' '}
        Mount WindowProvider
      </label>
      {mounted ? (
        <WindowProvider>
          <Main />
        </WindowProvider>
      ) : (
        <i>Provider unmounted — no glass should remain on the page.</i>
      )}
    </div>
  )
}

function Main() {
  const { addWindowlessGlass } = useWindow()
  const counter = React.useRef(0)

  function handleOpen() {
    const n = ++counter.current
    addWindowlessGlass({
      title: `Glass ${n}`,
      content: <div style={{ padding: 8 }}>windowless {n}</div>,
    })
  }

  return (
    <div style={{ marginBottom: 12 }}>
      <button onClick={handleOpen}>Add windowless</button>
    </div>
  )
}
