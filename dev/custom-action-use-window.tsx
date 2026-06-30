import React from 'react'
import { DEFAULT_GLASS_ACTIONS, Window, WindowProvider, useWindow } from '../src'

export default function App() {
  return (
    <WindowProvider>
      <Main />
    </WindowProvider>
  )
}

function Main() {
  const { removePane, updatePane } = useWindow()

  const updateAction: Action = {
    id: 'update-content',
    label: 'Update content',
    placement: 'menu',
    onClick: () => {
      updatePane('a', {
        title: 'Updated title',
        content: <mark>This content has been updated</mark>,
      })
    },
  }

  const removeAction: Action = {
    id: 'remove-pane',
    label: 'Remove pane',
    placement: 'menu',
    onClick: () => {
      removePane('a')
    },
  }

  const actions = [...DEFAULT_GLASS_ACTIONS, updateAction, removeAction]

  return (
    <div style={{ padding: 20 }}>
      <h2>Update / remove pane via useWindow</h2>
      <Window
        width={555}
        height={333}
        panes={[
          {
            id: 'a',
            size: 0.5,
            title: 'Original title',
            actions: actions,
            content: <i>Click the button from the top left menu to remove this pane</i>,
          },
          {
            id: 'b',
            title: 'Untouched',
            content: <i>This pane should stay the same</i>,
          },
        ]}
      />
    </div>
  )
}
