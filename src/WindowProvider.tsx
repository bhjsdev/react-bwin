import * as React from 'react'

type WindowApi = {
  addPane: () => void
  removePane: () => void
  fit: () => void
  setTheme: (theme: string) => void
}

const api: WindowApi = {
  addPane: () => {
    console.log('no-op addPane')
  },
  removePane: () => {
    console.log('no-op removePane')
  },
  fit: () => {
    console.log('no-op fit')
  },
  setTheme: (theme: string) => {
    console.log('no-op setTheme', theme)
  },
}

const WindowContext = React.createContext<WindowApi>(api)

export function WindowProvider({ children }: React.PropsWithChildren<{}>) {
  return <WindowContext.Provider value={api}>{children}</WindowContext.Provider>
}

export function useWindow() {
  return React.useContext(WindowContext)
}