import React, {
  useRef,
  useEffect,
  useLayoutEffect,
  useContext,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
  ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { BinaryWindow } from 'bwin'
import Muntin from './Muntin.tsx'
import Pane from './Pane.tsx'
import { WindowContext } from './WindowProvider.tsx'
import 'bwin/bwin.css'

// Maps a sash id to the content node and the bw-glass-content it portals into.
type PaneContentPortalMap = Map<string, { node: ReactNode; container: HTMLElement }>

export default forwardRef<WindowApi, WindowProps>((props, ref) => {
  const windowRef = useRef<HTMLElement>()
  const sillRef = useRef<HTMLElement>()
  // Pane content renders via portals keyed by sash id, so updatePane can swap a
  // single pane's content without re-rendering the memoized window tree.
  const [paneContentPortals, setPaneContentPortals] =
    useState<PaneContentPortalMap>(() => new Map())

  const { panes: panesProp, ...restProps } = props
  const settings = { ...restProps, children: panesProp }

  const bwin = new BinaryWindow(settings)
  const muntins: Sash[] = []
  const panes: Sash[] = []

  bwin.rootSash.walk((sash: Sash) => {
    if (sash.children.length > 0) {
      muntins.push(sash)
    } else {
      panes.push(sash)
    }
  })

  useEffect(() => {
    const windowEl = windowRef.current

    if (windowEl?.parentElement) {
      bwin.windowElement = windowEl
      bwin.containerElement = windowEl.parentElement
      bwin.sillElement = sillRef.current!
      bwin.enableFeatures()
    }
  }, [])

  // Seed each pane's initial content into a portal before paint (avoids a flash
  // of empty panes).
  useLayoutEffect(() => {
    const initial: PaneContentPortalMap = new Map()

    for (const sash of panes) {
      if (sash.store?.content == null) continue

      const container = windowRef.current?.querySelector(
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

  useImperativeHandle(
    ref,
    () => ({
      fit: bwin.fit.bind(bwin),
      setTheme: bwin.setTheme.bind(bwin),
      addPane,
      removePane,
      updatePane,
    }),
    []
  )

  const windowContext = useContext(WindowContext)

  useEffect(() => {
    if (!windowContext) {
      return
    }

    windowContext.api.current = {
      fit: bwin.fit.bind(bwin),
      setTheme: bwin.setTheme.bind(bwin),
      addPane,
      removePane,
      updatePane,
    }

    return () => {
      windowContext.api.current = null
    }
  }, [])

  const windowNode = (
    <bw-window
      root-sash-id={bwin.rootSash.id}
      theme={bwin.theme || undefined}
      style={{ width: bwin.rootSash.width, height: bwin.rootSash.height }}
      ref={windowRef}
    >
      {panes.map((sash) => (
        <Pane key={sash.id} sash={sash} bwin={bwin} />
      ))}
      {muntins.map((sash) => (
        <Muntin key={sash.id} sash={sash} />
      ))}
      <bw-sill ref={sillRef} />
    </bw-window>
  )

  const memoizedWindowNode = useMemo(() => windowNode, [])

  function addPane(targetPaneSashId: string, fields: PaneFields) {
    const { content, ...restFields } = fields
    const sash = bwin.addPane(targetPaneSashId, restFields)
    const glassContentEl = document.querySelector(
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

  return (
    <>
      {memoizedWindowNode}
      {[...paneContentPortals].map(([sashId, { node, container }]) =>
        createPortal(node, container, sashId)
      )}
    </>
  )
})
