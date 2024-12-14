import { Window } from '../src'
import React, { createContext, useContext, useState, ReactNode } from 'react'

const ContentContext = createContext<{
  storage: Record<string, ReactNode>
  updateStorage: (key: string, node: ReactNode) => void
}>({
  storage: {},
  updateStorage: () => {},
})

function WindowProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<Record<string, ReactNode>>({})

  function updateStore(key: string, newContent: ReactNode) {
    setStore((prev) => ({ ...prev, [key]: newContent }))
  }

  return (
    <ContentContext.Provider
      value={{ storage: store, updateStorage: updateStore }}
    >
      {children}
    </ContentContext.Provider>
  )
}

function useWindow() {
  return useContext(ContentContext)
}

function PaneContent() {
  const { storage: store } = useWindow()
  const [internal, setInternal] = useState('default internal content')

  return (
    <div>
      <p>External: {store.x}</p>
      <button onClick={() => setInternal(Math.random().toString())}>
        Update internal content
      </button>
      <p>Internal: {internal}</p>
    </div>
  )
}

function ContentUpdater() {
  const { updateStorage } = useWindow()

  return (
    <button onClick={() => updateStorage('x', <mark>{Math.random()}</mark>)}>
      Update Content
    </button>
  )
}

export default function App() {
  return (
    <div style={{ padding: 20 }}>
      <WindowProvider>
        <ContentUpdater />
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
      </WindowProvider>
    </div>
  )
}
