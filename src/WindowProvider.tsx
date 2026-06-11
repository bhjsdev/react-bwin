import * as React from 'react'

type WindowContextValue = {
  api: React.MutableRefObject<WindowApi | null>
}

export const WindowContext = React.createContext<WindowContextValue | null>(
  null
)

export function WindowProvider({ children }: React.PropsWithChildren<{}>) {
  const api = React.useRef<WindowApi | null>(null)

  return (
    <WindowContext.Provider value={{ api }}>{children}</WindowContext.Provider>
  )
}

export function useWindow(): WindowApi {
  const context = React.useContext(WindowContext)

  if (!context) {
    throw new Error('useWindow must be used within a WindowProvider')
  }

  const { api } = context

  return React.useMemo<WindowApi>(
    () => ({
      addPane: (targetPaneId, fields) =>
        api.current?.addPane(targetPaneId, fields),
      removePane: (targetPaneId) => api.current?.removePane(targetPaneId),
      fit: () => api.current?.fit(),
      setTheme: (theme) => api.current?.setTheme(theme),
    }),
    [api]
  )
}
