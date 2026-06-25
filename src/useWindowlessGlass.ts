import { useState, ReactNode } from 'react'
import { BinaryWindow } from 'bwin'

// Maps a windowless-glass id to the content node and the bw-glass-content it
// portals into. Mirrors usePaneContentPortals, but keyed by glass id since a
// windowless glass floats on document.body rather than living in a pane.
export type WindowlessGlassPortalMap = Map<
  string,
  { node: ReactNode; container: HTMLElement }
>

// Owns the windowless-glass content portals and the add/remove functions.
// addWindowlessGlass/removeWindowlessGlass are static on BinaryWindow (the glass
// is detached from any window instance), so this hook needs no bwin instance.
export default function useWindowlessGlass() {
  const [windowlessGlassPortals, setWindowlessGlassPortals] =
    useState<WindowlessGlassPortalMap>(() => new Map())

  function addWindowlessGlass(options: WindowlessGlassOptions = {}) {
    const { content, ...rest } = options
    const glassEl = BinaryWindow.addWindowlessGlass(rest)

    if ('content' in options) {
      const contentEl = glassEl.querySelector('bw-glass-content')

      if (contentEl) {
        setWindowlessGlassPortals((prev) =>
          new Map(prev).set(glassEl.id, {
            node: content,
            container: contentEl as HTMLElement,
          })
        )
      }
    }

    return glassEl
  }

  function removeWindowlessGlass(
    windowlessGlassId: string,
    options?: RemoveWindowlessGlassOptions
  ) {
    const removed = BinaryWindow.removeWindowlessGlass(
      windowlessGlassId,
      options
    )

    setWindowlessGlassPortals((prev) => {
      if (!prev.has(windowlessGlassId)) return prev

      const next = new Map(prev)
      next.delete(windowlessGlassId)
      return next
    })

    return removed
  }

  return {
    windowlessGlassPortals,
    setWindowlessGlassPortals,
    addWindowlessGlass,
    removeWindowlessGlass,
  }
}
