import React, { useState } from 'react'
import { Window, BUILTIN_ACTIONS } from '../src'
import Counter from './Counter'
import { ContentProvider, useContentAPI } from './ContentContext'

function DynamicContent() {
  const { content } = useContentAPI()

  if (!content) {
    return <p>Default content</p>
  }
  return <p>Updated by external button {content}</p>
}

function Content() {
  const { updateContent } = useContentAPI()

  return (
    <button onClick={() => updateContent(<mark>xxx</mark>)}>
      Update Content
    </button>
  )
}

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{ padding: 20 }}>
      <div
        id="react-container"
        style={{ width: 555, height: 555, backgroundColor: 'pink' }}
      >
        <button onClick={() => setCount((count) => count + 1)}>
          Click to trigger re-render, count is {count}
        </button>
        <ContentProvider>
          <Content />
          <Window
            width={444}
            height={333}
            fitContainer={false}
            content={<em>Root!</em>}
            panes={[
              {
                size: 0.4,
                content: <DynamicContent />,
                actions: [
                  {
                    label: 'Update',
                    onClick: (event, bwin) => {
                      const glassEl = (
                        event.target as HTMLButtonElement
                      ).closest('bw-glass') as HTMLElement
                      const contentEl =
                        glassEl.querySelector('bw-glass-content')

                      if (contentEl) {
                        contentEl.innerHTML = `Updated by action button ${bwin.rootSash.id}`
                      }
                    },
                  },
                  ...BUILTIN_ACTIONS,
                ],
              },
              {
                children: [
                  {
                    id: 'top-right',
                    size: 0.5,
                    position: 'top',
                    content: <Counter />,
                  },
                  {
                    id: 'bottom-right',
                    title: <mark>no drag</mark>,
                    draggable: false,
                  },
                ],
              },
            ]}
          />
        </ContentProvider>
      </div>
    </div>
  )
}
