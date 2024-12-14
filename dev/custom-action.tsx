import React from 'react'
import { Window, BUILTIN_ACTIONS } from '../src'

export default function App() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Custom action</h2>
      <Window
        width={444}
        height={333}
        panes={[
          {
            content: <i>Default content</i>,
            actions: [
              {
                label: 'Update',
                onClick: (event, bwin) => {
                  const glassEl = (event.target as HTMLButtonElement).closest(
                    'bw-glass'
                  ) as HTMLElement
                  const contentEl = glassEl.querySelector('bw-glass-content')

                  if (contentEl) {
                    contentEl.innerHTML = `<mark>Updated by action button ${bwin.rootSash.id}</mark>`
                  }
                },
              },
              ...BUILTIN_ACTIONS,
            ],
          },
        ]}
      />
    </div>
  )
}
