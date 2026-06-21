import React from 'react'
import { Window, DEFAULT_GLASS_ACTIONS } from '../src'

const dropdownActions = [
  {
    label: 'Update content',
    placement: 'list',
    onClick: (event: React.MouseEvent<HTMLButtonElement>, bwin: BinaryWindow) => {
      const glassEl = (event.target as HTMLButtonElement).closest(
        'bw-glass'
      ) as HTMLElement
      const contentEl = glassEl.querySelector('bw-glass-content')

      if (contentEl) {
        contentEl.innerHTML = `<mark>Updated by action from action menu, root sash id: ${bwin.rootSash.id}</mark>`
      }
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
        width={555}
        height={333}
        panes={[
          {
            content: <i>Click the "Update" button in the action bar</i>,
            actions: [
              {
                label: 'Update',
                onClick: (event, bwin) => {
                  const glassEl = (event.target as HTMLButtonElement).closest(
                    'bw-glass'
                  ) as HTMLElement
                  const contentEl = glassEl.querySelector('bw-glass-content')

                  if (contentEl) {
                    contentEl.innerHTML = `<mark>Updated by action from action bar, root sash id: ${bwin.rootSash.id}</mark>`
                  }
                },
              },
              ...DEFAULT_GLASS_ACTIONS,
            ],
          },
          {
            content: <i>Click "Update content" in the action menu</i>,
            actions: [...dropdownActions, ...DEFAULT_GLASS_ACTIONS],
          }
        ]}
      />
    </div>
  )
}
