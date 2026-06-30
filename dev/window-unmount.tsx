import React from 'react'
import { Window } from '../src'

// Detached-glass teardown when the Window itself unmounts — no WindowProvider.
// A glass detached from the window (the ☐ action) is appended INSIDE the
// bw-window element, which React owns, so unmounting the Window removes it too.
// Detach a pane, then untick the checkbox: nothing should linger on the page.
export default function App() {
  const [mounted, setMounted] = React.useState(true)

  return (
    <div style={{ padding: 20 }}>
      <h2>Window — unmount cleanup</h2>
      <ol>
        <li>
          Detach a pane from the window with its <b>☐</b> action.
        </li>
        <li>
          Without closing it, untick <b>Mount Window</b>.
        </li>
        <li>
          The detached glass should disappear with the window. Anything left on
          the page is an orphaned glass.
        </li>
      </ol>
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
