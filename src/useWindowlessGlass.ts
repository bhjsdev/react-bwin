import { useEffect, useRef, useState, ReactNode } from 'react'
import { BinaryWindow } from 'bwin'

export type WindowlessGlassPortalMap = Map<
  string,
  { node: ReactNode; container: HTMLElement }
>

export default function useWindowlessGlass() {
  const [windowlessGlassPortals, setWindowlessGlassPortals] =
    useState<WindowlessGlassPortalMap>(() => new Map())

  const liveGlassIdsRef = useRef<Set<string>>(new Set())

  async function addWindowlessGlass(options: WindowlessGlassOptions = {}) {
    const { content, ...rest } = options
    const glassEl = await BinaryWindow.addWindowlessGlass(rest)

    liveGlassIdsRef.current.add(glassEl.id)

    if ('content' in options) {
      const contentEl = glassEl.querySelector('bw-glass-content')

      if (contentEl) {
        // There's a delay to show content due to the opening animation
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

  async function removeWindowlessGlass(
    windowlessGlassId: string,
    options?: RemoveWindowlessGlassOptions
  ) {
    await BinaryWindow.removeWindowlessGlass(windowlessGlassId, options)

    liveGlassIdsRef.current.delete(windowlessGlassId)

    setWindowlessGlassPortals((prev) => {
      if (!prev.has(windowlessGlassId)) return prev

      const next = new Map(prev)
      next.delete(windowlessGlassId)
      return next
    })
  }

  // A windowless glass lives on document.body, outside React's tree. Without
  // this, open glasses (and any modal backdrop) are orphaned on provider unmount.
  useEffect(() => {
    const liveGlassIds = liveGlassIdsRef.current

    return () => {
      liveGlassIds.forEach((id) =>
        BinaryWindow.removeWindowlessGlass(id, { animate: false })
      )

      liveGlassIds.clear()
    }
  }, [])

  return {
    windowlessGlassPortals,
    setWindowlessGlassPortals,
    addWindowlessGlass,
    removeWindowlessGlass,
  }
}
