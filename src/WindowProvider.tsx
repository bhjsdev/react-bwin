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
  // The Proxy forwards any method to api.current at call time (the window only
  // populates it after it mounts), throwing if it's not ready. New WindowApi
  // methods work automatically — no need to list them here.
  const apiRef = React.useRef<WindowApi>()

  if (!apiRef.current) {
    apiRef.current = new Proxy({} as WindowApi, {
      get(_target, key: keyof WindowApi) {
        return (...args: unknown[]) => {
          if (!api.current) {
            throw new Error(
              '[react-bwin] Window API is not ready yet. ' +
                'Render a <Window> inside the <WindowProvider> before calling its methods.'
            )
          }
          const method = api.current[key] as (...args: unknown[]) => unknown
          return method(...args)
        }
      },
    })
  }

  return apiRef.current
}
