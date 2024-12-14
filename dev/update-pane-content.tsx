import { Window } from '../src'
import React, { createContext, ReactNode, useContext, useState } from 'react'

const ContentContext = createContext<{
  store: Record<string, unknown>
  updateStore: (key: string, value: unknown) => void
}>({
  store: {},
  updateStore: () => {},
})

function WindowProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<Record<string, unknown>>({})

  function updateStore(key: string, value: unknown) {
    setStore((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <ContentContext.Provider value={{ store, updateStore }}>
      {children}
    </ContentContext.Provider>
  )
}

function useStore() {
  return useContext(ContentContext)
}

function PaneContent() {
  const { store } = useStore()
  const [internal, setInternalContent] = useState('default internal content')

  return (
    <div>
      <p>External: {store.x}</p>
      <button onClick={() => setInternalContent(Math.random().toString())}>
        Update internal content
      </button>
      <p>Internal: {internal}</p>
    </div>
  )
}

function Main() {
  const { updateStore } = useStore()

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => updateStore('x', Math.random().toString())}>
        Update Content
      </button>
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

export default function App() {
  return (
    <WindowProvider>
      <Main />
    </WindowProvider>
  )
}
