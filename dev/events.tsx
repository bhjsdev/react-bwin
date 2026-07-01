import React, { useEffect, useRef, useState } from 'react'
import { Window, WindowProvider, useWindow } from '../src'

// bwin's per-instance emitter fires these. Pane-lifecycle events carry the
// affected `Sash`; glass-action events carry the `<bw-glass>` element. Only the
// `before-*` events are vetoable — a listener returning `false` cancels the op.
const EVENTS: BinaryWindowEvent[] = [
  'before-pane-add',
  'pane-add',
  'before-pane-remove',
  'pane-remove',
  'close',
  'minimize',
  'maximize',
  'unmaximize',
  'detach',
  'attach',
  'restore',
]

type LogEntry = { seq: number; name: BinaryWindowEvent; detail: string }

function describe(detail: unknown): string {
  if (detail && typeof detail === 'object' && 'id' in detail) {
    return `Sash#${(detail as Sash).id}`
  }
  if (detail instanceof HTMLElement) {
    return `<${detail.tagName.toLowerCase()}${detail.id ? ` #${detail.id}` : ''}>`
  }
  return String(detail)
}

export default function App() {
  return (
    <WindowProvider>
      <Main />
    </WindowProvider>
  )
}

function Main() {
  const { on, off, addPane, removePane } = useWindow()
  const [log, setLog] = useState<LogEntry[]>([])
  const [veto, setVeto] = useState(false)
  // Read `veto` from a ref so the listeners (bound once) always see the latest.
  const vetoRef = useRef(veto)
  vetoRef.current = veto

  const seqRef = useRef(0)

  useEffect(() => {
    const listeners = EVENTS.map((name) => {
      const listener: BinaryWindowEventListener<typeof name> = (detail) => {
        setLog((prev) => [
          { seq: seqRef.current++, name, detail: describe(detail) },
          ...prev,
        ])

        // Veto both vetoable events to show a returned `false` cancels the op.
        if (vetoRef.current && name.startsWith('before-')) {
          return false
        }
      }

      on(name, listener)
      return { name, listener }
    })

    return () => {
      listeners.forEach(({ name, listener }) => off(name, listener))
    }
  }, [on, off])

  return (
    <>
      <h2>Events</h2>
      <p>
        Add/remove panes, or use a glass's action buttons (minimize, maximize,
        detach, close) to fire events. Detach then re-attach or restore.
      </p>
      <label>
        <input
          type="checkbox"
          checked={veto}
          onChange={(event) => setVeto(event.target.checked)}
        />{' '}
        Veto <code>before-*</code> events (cancels pane add/remove)
      </label>

      <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
        <div style={{ width: 640, height: 400 }}>
          <Window
            fitContainer
            panes={[
              { id: 'a', size: 0.5, title: 'a', content: 'a' },
              { id: 'b', size: 0.5, title: 'b', content: 'b' },
            ]}
          />
        </div>

        <div style={{ flex: 1 }}>
          <button onClick={() => addPane('a', { position: 'right', content: 'new' })}>
            Add pane (target a)
          </button>
          <button
            onClick={() => {
              // bwin throws if the sash is already gone — swallow so the page
              // stays usable after b has been removed.
              try {
                removePane('b')
              } catch (error) {
                console.warn(error)
              }
            }}
          >
            Remove pane b
          </button>
          <button onClick={() => setLog([])}>Clear log</button>

          <ol
            style={{
              marginTop: 12,
              maxHeight: 340,
              overflow: 'auto',
              fontFamily: 'monospace',
              fontSize: 12,
            }}
          >
            {log.map((entry) => (
              <li key={entry.seq}>
                <strong>{entry.name}</strong> → {entry.detail}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </>
  )
}
