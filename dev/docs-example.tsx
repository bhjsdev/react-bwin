import React from 'react'
import { Window } from '../src'

export default function App() {
  return (
    <div style={{ width: '80vw', height: '40vh', margin: '5% auto 0' }}>
      <Window
        fitContainer
        panes={[
          {
            position: 'left',
            size: '30%',
            title: 'Title',
            content: 'Content',
          },
          {
            position: 'right',
            children: [
              {
                position: 'top',
                size: '30%',
                title: <i>No action buttons</i>,
                actions: null,
              },
              {
                position: 'bottom',
                size: '70%',
                children: [
                  {
                    position: 'left',
                    size: '50%',
                    draggable: false,
                    content: 'Drag disabled',
                  },
                  {
                    position: 'right',
                    size: '50%',
                    content: ' Drop disabled',
                    droppable: false,
                  },
                ],
              },
            ],
          },
        ]}
      />
    </div>
  )
}
