import { useState, useLayoutEffect, MutableRefObject, ReactNode } from 'react'

// Maps a sash id to the content node and the bw-glass-content it portals into.
export type PaneContentPortalMap = Map<
  string,
  { node: ReactNode; container: HTMLElement }
>

// Owns the pane-content portal state and the add/update/remove pane functions.
// Pane content renders via portals keyed by sash id, so updatePane can swap a
// single pane's content without re-rendering the memoized window tree.
export default function usePaneContentPortals(
  bwin: BinaryWindow,
  windowRef: MutableRefObject<HTMLElement | undefined>,
  panes: Sash[]
) {
  const [paneContentPortals, setPaneContentPortals] =
    useState<PaneContentPortalMap>(() => new Map())

  function addPane(targetPaneSashId: string, fields: PaneFields) {
    const { content, ...restFields } = fields
    const sash = bwin.addPane(targetPaneSashId, restFields)
    // A vetoed `before-pane-add` (listener returned `false`) makes bwin's
    // `addPane` return null — nothing was added, so there's no portal to seed.
    if (!sash) return
    const windowEl = windowRef.current
    const glassContentEl = windowEl?.querySelector(
      `bw-pane[sash-id="${sash.id}"] bw-glass-content`
    )

    setPaneContentPortals((prev) =>
      new Map(prev).set(sash.id, {
        node: content,
        container: glassContentEl as HTMLElement,
      })
    )
  }

  function updatePane(sashId: string, options: UpdatePaneOptions) {
    const { content, ...rest } = options

    if (Object.keys(rest).length > 0) {
      bwin.updatePane(sashId, rest)
    }

    if ('content' in options) {
      setPaneContentPortals((prev) => {
        const portal = prev.get(sashId)
        if (!portal) return prev
        return new Map(prev).set(sashId, { ...portal, node: content })
      })
    }
  }

  function removePane(sashId: string) {
    bwin.removePane(sashId)

    setPaneContentPortals((prev) => {
      if (!prev.has(sashId)) return prev

      const next = new Map(prev)
      next.delete(sashId)
      return next
    })
  }

  // A detached glass floats INSIDE the bw-window (React owns that subtree), so
  // its content portals through the same map as panes, keyed by the glass id.
  async function addDetachedGlass(options: DetachedGlassOptions = {}) {
    const { content, ...rest } = options
    const glassEl = await bwin.addDetachedGlass(rest)

    if ('content' in options) {
      const glassContentEl = glassEl.querySelector('bw-glass-content')

      if (glassContentEl) {
        setPaneContentPortals((prev) =>
          new Map(prev).set(glassEl.id, {
            node: content,
            container: glassContentEl as HTMLElement,
          })
        )
      }
    }

    return glassEl
  }

  async function removeDetachedGlass(
    id: string,
    options?: RemoveDetachedGlassOptions
  ) {
    const removedGlassEl = await bwin.removeDetachedGlass(id, options)

    setPaneContentPortals((prev) => {
      if (!prev.has(id)) return prev

      const next = new Map(prev)
      next.delete(id)
      return next
    })

    return removedGlassEl
  }

  // Seed each pane's initial content into a portal before paint (avoids a flash
  // of empty panes).
  useLayoutEffect(() => {
    const windowEl = windowRef.current
    const initial: PaneContentPortalMap = new Map()

    for (const sash of panes) {
      if (sash.store?.content == null) continue

      const container = windowEl?.querySelector(
        `bw-pane[sash-id="${sash.id}"] bw-glass-content`
      )

      if (container) {
        initial.set(sash.id, {
          node: sash.store.content,
          container: container as HTMLElement,
        })
      }
    }

    setPaneContentPortals(initial)

    // Detach/attach destroy the old owner (the source pane on detach, the
    // detached glass on attach) and create a new one with a fresh id, so the
    // portal key — which names that owner — goes stale. bwin's `transferGlass`
    // moves the `bw-glass-content` element itself between them, so the container
    // is the one constant that rides through. Find the entry by that surviving
    // container and re-key it to the new owner so lookups (portal key,
    // updatePane, close) keep resolving and the content stays mounted.
    function rekeyPortalByContainer(glassEl: HTMLElement, newKey: string) {
      const contentEl = glassEl.querySelector('bw-glass-content')
      if (!contentEl) return

      setPaneContentPortals((prev) => {
        for (const [key, portal] of prev) {
          if (portal.container !== contentEl) continue
          if (key === newKey) return prev

          const next = new Map(prev)
          next.delete(key)
          next.set(newKey, portal)
          return next
        }
        return prev
      })
    }

    // Detached glass owns the content now; key by the detached glass id.
    function handleDetach(detachedGlassEl: HTMLElement) {
      rekeyPortalByContainer(detachedGlassEl, detachedGlassEl.id)
    }

    // Re-attached into a freshly-built pane; key by that pane's new sash id.
    function handleAttach(glassEl: HTMLElement) {
      const paneSashId = glassEl.closest('bw-pane')?.getAttribute('sash-id')
      if (paneSashId) rekeyPortalByContainer(glassEl, paneSashId)
    }

    // Close destroys the glass (attached or detached) — drop its portal. The
    // built-in close action calls removePane/removeDetachedGlass directly,
    // bypassing the wrapper's removePane, so prune by the moved container here.
    function handleClose(glassEl: HTMLElement) {
      const contentEl = glassEl.querySelector('bw-glass-content')
      if (!contentEl) return

      setPaneContentPortals((prev) => {
        for (const [key, portal] of prev) {
          if (portal.container !== contentEl) continue
          const next = new Map(prev)
          next.delete(key)
          return next
        }
        return prev
      })
    }

    bwin.on('detach', handleDetach)
    bwin.on('attach', handleAttach)
    bwin.on('close', handleClose)

    return () => {
      bwin.off('detach', handleDetach)
      bwin.off('attach', handleAttach)
      bwin.off('close', handleClose)
    }
  }, [])

  return {
    paneContentPortals,
    setPaneContentPortals,
    addPane,
    updatePane,
    removePane,
    addDetachedGlass,
    removeDetachedGlass,
  }
}
