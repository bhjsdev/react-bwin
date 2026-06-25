import * as React from 'react'
import { createPortal } from 'react-dom'
import useWindowlessGlass from './useWindowlessGlass.ts'

type WindowContextValue = {
  windowApi: React.MutableRefObject<WindowApi | null>
  windowlessApi: WindowlessGlassApi
}

export const WindowContext = React.createContext<WindowContextValue | null>(
  null
)

export function WindowProvider({ children }: React.PropsWithChildren<{}>) {
  const windowApi = React.useRef<WindowApi | null>(null)

  // Windowless glass uses static BinaryWindow methods and portals onto
  // document.body, so it lives on the provider and works without a <Window>.
  const { windowlessGlassPortals, addWindowlessGlass, removeWindowlessGlass } =
    useWindowlessGlass()

  const windowlessApi: WindowlessGlassApi = {
    addWindowlessGlass,
    removeWindowlessGlass,
  }

  return (
    <WindowContext.Provider value={{ windowApi, windowlessApi }}>
      {children}
      {[...windowlessGlassPortals].map(([glassId, { node, container }]) =>
        createPortal(node, container, glassId)
      )}
    </WindowContext.Provider>
  )
}

export function useWindow(): WindowApi & WindowlessGlassApi {
  const context = React.useContext(WindowContext)

  if (!context) {
    throw new Error('useWindow must be used within a WindowProvider')
  }

  const { windowApi, windowlessApi } = context

  // Build the API once and lock its identity (via a ref, not useMemo: React may
  // discard a memo's cache, breaking identity stability) so it's stable in
  // consumer dependency arrays.
  const apiRef = React.useRef<WindowApi & WindowlessGlassApi>()

  if (!apiRef.current) {
    // A Proxy lets every WindowApi method work without listing it here. Reading
    // a key returns a function that, when called, forwards to the live method on
    // windowApi.current (the window only populates it after it mounts), e.g.:
    //
    //   useWindow().addPane('a', {...})
    //     -> get('addPane') returns (...args) => windowApi.current.addPane(...args)
    //     -> calls windowApi.current.addPane('a', {...}), or throws if not mounted
    //
    // Windowless-glass methods live on the provider, so they're returned directly.
    apiRef.current = new Proxy({} as WindowApi & WindowlessGlassApi, {
      get(_target, key: keyof (WindowApi & WindowlessGlassApi)) {
        if (key in windowlessApi) {
          return windowlessApi[key as keyof WindowlessGlassApi]
        }

        return (...args: unknown[]) => {
          if (!windowApi.current) {
            throw new Error(
              '[react-bwin] Window API is not ready yet. ' +
                'Render a <Window> inside the <WindowProvider> before calling its methods.'
            )
          }

          const method = windowApi.current[key as keyof WindowApi] as (
            ...args: unknown[]
          ) => unknown
          return method(...args)
        }
      },
    })
  }

  return apiRef.current
}
