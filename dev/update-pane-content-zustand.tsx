import { Window } from '../src'
import React, { useState, ReactNode } from 'react'
import { create } from 'zustand'

type Store = {
  content: ReactNode
  updateContent: (newContent: ReactNode) => void
}

const useStore = create<Store>((set) => ({
  content: 'default external content',
  updateContent: (newContent: ReactNode) => set({ content: newContent }),
}))

function PaneContent() {
  const [internal, setInternalContent] = useState('default internal content')
  const content = useStore((state) => state.content)

  return (
    <div>
      <p>External: {content}</p>
      <button onClick={() => setInternalContent(Math.random().toString())}>
        Update internal content
      </button>
      <p>Internal: {internal}</p>
    </div>
  )
}

export default function App() {
  const update = useStore((state) => state.updateContent)

  function handleClick() {
    update(Math.random().toString())
  }

  return (
    <div style={{ padding: 20 }}>
      <button onClick={handleClick}>Update Content</button>
      <Window
        width={444}
        height={333}
        fitContainer={false}
        panes={[
          {
            size: 0.4,
            content: <PaneContent />,
          },
        ]}
      />
    </div>
  )
}
