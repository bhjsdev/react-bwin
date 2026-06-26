import React from 'react'
import { Window, WindowProvider, useWindow } from '../src'

// Repro/contrast for detached-glass teardown when the provider unmounts.
// - Windowless glass is appended to document.body by a static BinaryWindow
//   method, outside React's tree, so React can't remove it — useWindowlessGlass
//   tears it down on unmount.
// - A glass detached from a window (the ☐ action) is appended INSIDE the
//   bw-window element, which React owns, so it's removed with the window.
// Untick the checkbox with both kinds open: neither should linger.
export default function App() {
  const [mounted, setMounted] = React.useState(true)

  return (
    <div style={{ padding: 20 }}>
      <h2>Detached glass — unmount cleanup</h2>
      <ol>
        <li>Open a windowless glass (try the modal too).</li>
        <li>
          Detach a pane from the window with its <b>☐</b> action.
        </li>
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

  function handleOpenModal() {
    const n = ++counter.current
    addWindowlessGlass({
      modal: true,
      title: `Modal glass ${n}`,
      content: <div style={{ padding: 8 }}>modal {n}</div>,
    })
  }

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <button onClick={handleOpen}>Add windowless</button>
        <button onClick={handleOpenModal}>Add modal</button>
      </div>
      <Window
        width={444}
        height={300}
        panes={[
          {
            size: 0.5,
            position: 'left',
            title: 'Pane 1',
            content: <div style={{ padding: 8 }}>Detach me with ☐</div>,
          },
          {
            title: 'Pane 2',
            content: <div style={{ padding: 8 }}>Detach me with ☐</div>,
          },
        ]}
      />
    </div>
  )
}
