import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { Window, DEFAULT_GLASS_ACTIONS } from '../src'

// The React component rendered into the pane when "Update" is clicked, instead
// of setting contentEl.innerHTML with a plain HTML string.
function UpdatedContent({ rootSashId }: { rootSashId: string }) {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>
        Rendered by a React component, root sash id: <mark>{rootSashId}</mark>
      </p>
      <button onClick={() => setCount((c) => c + 1)}>Clicked {count} times</button>
    </div>
  )
}

export default function App() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Custom action — update content with a React component</h2>
      <Window
        width={555}
        height={333}
        panes={[
          {
            content: <i>Click the "Update" button in the action bar</i>,
            actions: [
              {
                label: 'Update',
                onClick: (
                  event: React.MouseEvent<HTMLButtonElement>,
                  bwin: BinaryWindow
                ) => {
                  const glassEl = (event.target as HTMLButtonElement).closest(
                    'bw-glass'
                  ) as HTMLElement
                  const contentEl = glassEl.querySelector('bw-glass-content')

                  if (contentEl) {
                    ReactDOM.render(
                      <UpdatedContent rootSashId={bwin.rootSash.id} />,
                      contentEl
                    )
                  }
                },
              },
              ...DEFAULT_GLASS_ACTIONS,
            ],
          },
        ]}
      />
    </div>
  )
}
