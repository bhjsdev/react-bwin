import * as React from 'react'
import { createPortal } from 'react-dom'
import { detachedGlassManager } from 'bwin'
import useWindowlessGlass from './useWindowlessGlass.ts'

type WindowContextValue = {
  windowApi: React.MutableRefObject<WindowApi | null>
  windowlessApi: WindowlessGlassApi
  detachedGlassManagerApi: DetachedGlassManagerApi
}

export const WindowContext = React.createContext<WindowContextValue | null>(
  null
)

export function WindowProvider({ children }: React.PropsWithChildren<{}>) {
  const windowApi = React.useRef<WindowApi | null>(null)

  const { windowlessGlassPortals, addWindowlessGlass, removeWindowlessGlass } =
    useWindowlessGlass()

  const windowlessApi: WindowlessGlassApi = {
    addWindowlessGlass,
    removeWindowlessGlass,
  }

  const detachedGlassManagerApi: DetachedGlassManagerApi = {
    setDetachedGlassBaseZIndex: (zIndex) =>
      detachedGlassManager.setBaseZIndex(zIndex),
  }

  return (
    <WindowContext.Provider
      value={{ windowApi, windowlessApi, detachedGlassManagerApi }}
    >
      {children}
      {[...windowlessGlassPortals].map(([glassId, { node, container }]) =>
        createPortal(node, container, glassId)
      )}
    </WindowContext.Provider>
  )
}

export function useWindow(): WindowApi &
  WindowlessGlassApi &
  DetachedGlassManagerApi {
  const context = React.useContext(WindowContext)

  if (!context) {
    throw new Error('useWindow must be used within a WindowProvider')
  }

  const { windowApi, windowlessApi, detachedGlassManagerApi } = context

  type CombinedApi = WindowApi & WindowlessGlassApi & DetachedGlassManagerApi

  // Build the API once and lock its identity (via a ref, not useMemo: React may
  // discard a memo's cache, breaking identity stability) so it's stable in
  // consumer dependency arrays.
  const apiRef = React.useRef<CombinedApi>()

  if (!apiRef.current) {
    // A Proxy lets every WindowApi method work without listing it here. Reading
    // a key returns a function that, when called, forwards to the live method on
    // windowApi.current (the window only populates it after it mounts), e.g.:
    //
    //   useWindow().addPane('a', {...})
    //     -> get('addPane') returns (...args) => windowApi.current.addPane(...args)
    //     -> calls windowApi.current.addPane('a', {...}), or throws if not mounted
    //
    // Windowless-glass and detached-glass-manager methods live on the provider,
    // so they're returned directly.
    apiRef.current = new Proxy({} as CombinedApi, {
      get(_target, key: keyof CombinedApi) {
        if (key in windowlessApi) {
          return windowlessApi[key as keyof WindowlessGlassApi]
        }

        if (key in detachedGlassManagerApi) {
          return detachedGlassManagerApi[key as keyof DetachedGlassManagerApi]
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
