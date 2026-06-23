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
  // consumer dependency arrays. Windowless-glass methods are bound directly;
  // window methods call through to windowApi.current, which the window only
  // populates after it mounts.
  const apiRef = React.useRef<WindowApi & WindowlessGlassApi>()

  if (!apiRef.current) {
    const getWindowApi = () => {
      if (!windowApi.current) {
        throw new Error(
          '[react-bwin] Window API is not ready yet. ' +
            'Render a <Window> inside the <WindowProvider> before calling its methods.'
        )
      }
      return windowApi.current
    }

    apiRef.current = {
      addPane: (...args) => getWindowApi().addPane(...args),
      updatePane: (...args) => getWindowApi().updatePane(...args),
      removePane: (...args) => getWindowApi().removePane(...args),
      fit: (...args) => getWindowApi().fit(...args),
      setTheme: (...args) => getWindowApi().setTheme(...args),
      addWindowlessGlass: windowlessApi.addWindowlessGlass,
      removeWindowlessGlass: windowlessApi.removeWindowlessGlass,
    }
  }

  return apiRef.current
}
