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
  }, [])

  return {
    paneContentPortals,
    setPaneContentPortals,
    addPane,
    updatePane,
    removePane,
  }
}
