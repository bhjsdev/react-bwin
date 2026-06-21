import React from 'react'
import { Window, DEFAULT_GLASS_ACTIONS } from '../src'

const dropdownActions = [
  {
    label: 'Action 1',
    placement: 'list',
    onClick: () => {
      alert('Action 1 clicked');
    },
  },
  {
    label: 'Dummy action',
    placement: 'list',
    onClick: () => {
      alert('Dummy action clicked');
    },
  },
  {
    label: 'Dummy action 2',
    placement: 'list',
    onClick: () => {
      alert('Dummy action 2 clicked');
    },
  },
];

export default function App() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Custom action</h2>
      <Window
        width={777}
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
              ...dropdownActions,
              ...DEFAULT_GLASS_ACTIONS,
            ],
          },
        ]}
      />
    </div>
  )
}
