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

  // Lazily build the API wrapper once and lock its identity for the lifetime
  // of the component (a ref is a true identity guarantee, unlike useMemo whose
  // cache React may discard). This keeps it safe to use in consumer dependency
  // arrays, e.g.:
  //
  //   const { setTheme } = useWindow()
  //   React.useEffect(() => {
  //     setTheme('dark')
  //   }, [setTheme]) // setTheme is stable, so this effect runs only once
  //
  // Methods resolve api.current at call time, since the window only populates
  // it after it mounts.
  const apiRef = React.useRef<WindowApi>()
  
  if (!apiRef.current) {
    apiRef.current = {
      addPane: (...args) => resolve(api).addPane(...args),
      removePane: (...args) => resolve(api).removePane(...args),
      fit: (...args) => resolve(api).fit(...args),
      setTheme: (...args) => resolve(api).setTheme(...args),
    }
  }

  return apiRef.current
}

function resolve(api: React.MutableRefObject<WindowApi | null>): WindowApi {
  if (!api.current) {
    throw new Error(
      '[react-bwin] Window API is not ready yet. ' +
        'Render a <Window> inside the <WindowProvider> before calling its methods.'
    )
  }
  return api.current
}
