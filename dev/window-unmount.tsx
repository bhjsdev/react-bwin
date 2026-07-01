import React from 'react'
import { Window } from '../src'

// Detached-glass teardown when the Window itself unmounts — no WindowProvider.
// A glass detached from the window (the ☐ action) is appended INSIDE the
// bw-window element, which React owns, so unmounting the Window removes it too.
// Detach a pane, then untick the checkbox: nothing should linger on the page.
export default function App() {
  const [mounted, setMounted] = React.useState(true)
  const windowRef = React.useRef<WindowApi>(null)
  const counter = React.useRef(0)
  const lastIdRef = React.useRef<string | null>(null)

  // Programmatic detached glass (same INSIDE-the-window subtree as the ☐ action).
  async function handleAddDetached() {
    const n = ++counter.current
    const glassEl = await windowRef.current!.addDetachedGlass({
      title: `Detached ${n}`,
      content: <div style={{ padding: 8 }}>detached {n}</div>,
    })
    lastIdRef.current = glassEl.id
  }

  function handleRemoveLast() {
    if (lastIdRef.current) {
      windowRef.current!.removeDetachedGlass(lastIdRef.current)
      lastIdRef.current = null
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Window — unmount cleanup</h2>
      <ol>
        <li>
          Detach a pane with its <b>☐</b> action, or use <b>Add detached</b>.
        </li>
        <li>
          Without closing it, untick <b>Mount Window</b>.
        </li>
        <li>
          The detached glass should disappear with the window. Anything left on
          the page is an orphaned glass.
        </li>
      </ol>
      <div style={{ margin: '12px 0' }}>
        <button onClick={handleAddDetached} disabled={!mounted}>
          Add detached
        </button>
        <button onClick={handleRemoveLast} disabled={!mounted}>
          Remove last
        </button>
      </div>
      <label style={{ display: 'block', margin: '12px 0' }}>
        <input
          type="checkbox"
          checked={mounted}
          onChange={(e) => setMounted(e.target.checked)}
        />{' '}
        Mount Window
      </label>
      {mounted ? (
        <Window
          ref={windowRef}
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
      ) : (
        <i>Window unmounted — no glass should remain on the page.</i>
      )}
    </div>
  )
}
