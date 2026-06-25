import { Window } from '../src'
import React, { useState, ReactNode } from 'react'
import { create } from 'zustand'

type Store = {
  content: ReactNode
  updateContent: (newContent: ReactNode) => void
  otherContent: ReactNode
  updateOtherContent: (newContent: ReactNode) => void
  outsideContent: ReactNode
  updateOutsideContent: (newContent: ReactNode) => void
}

const useStore = create<Store>((set) => ({
  content: 'default external content',
  updateContent: (newContent: ReactNode) => set({ content: newContent }),
  otherContent: 'default other pane content',
  updateOtherContent: (newContent: ReactNode) => set({ otherContent: newContent }),
  outsideContent: 'default outside content',
  updateOutsideContent: (newContent: ReactNode) => set({ outsideContent: newContent }),
}))

function PaneContent() {
  const [internal, setInternalContent] = useState('default internal content')
  const content = useStore((state) => state.content)
  const updateOther = useStore((state) => state.updateOtherContent)
  const updateOutside = useStore((state) => state.updateOutsideContent)

  return (
    <div>
      <p>External: {content}</p>
      <button onClick={() => setInternalContent(Math.random().toString())}>
        Update internal content
      </button>
      <p>Internal: {internal}</p>
      <button onClick={() => updateOther(Math.random().toString())}>
        Update other pane
      </button>
      <button onClick={() => updateOutside(Math.random().toString())}>
        Update outside window
      </button>
    </div>
  )
}

function OtherPaneContent() {
  const otherContent = useStore((state) => state.otherContent)

  return <p>Other pane: {otherContent}</p>
}

export default function App() {
  const update = useStore((state) => state.updateContent)
  const outsideContent = useStore((state) => state.outsideContent)

  function handleClick() {
    update(Math.random().toString())
  }

  return (
    <div style={{ padding: 20 }}>
      <button onClick={handleClick}>Update Content</button>
      <p>Outside: {outsideContent}</p>
      <Window
        width={444}
        height={333}
        fitContainer={false}
        panes={[
          {
            size: 0.4,
            content: <PaneContent />,
          },
          {
            size: 0.6,
            content: <OtherPaneContent />,
          },
        ]}
      />
    </div>
  )
}
