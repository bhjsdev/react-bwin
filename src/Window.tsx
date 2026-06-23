import React, {
  useRef,
  useEffect,
  useContext,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from 'react'
import { createPortal } from 'react-dom'
import { BinaryWindow } from 'bwin'
import Muntin from './Muntin.tsx'
import Pane from './Pane.tsx'
import { WindowContext } from './WindowProvider.tsx'
import usePaneContentPortals from './usePaneContentPortals.ts'
import 'bwin/bwin.css'

export default forwardRef<WindowApi, WindowProps>((props, ref) => {
  const windowRef = useRef<HTMLElement>()
  const sillRef = useRef<HTMLElement>()

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

  const { paneContentPortals, addPane, updatePane, removePane } =
    usePaneContentPortals(bwin, windowRef, panes)

  useEffect(() => {
    const windowEl = windowRef.current

    if (windowEl?.parentElement) {
      bwin.windowElement = windowEl
      bwin.containerElement = windowEl.parentElement
      bwin.sillElement = sillRef.current!
      bwin.enableFeatures()
    }
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

    windowContext.windowApi.current = {
      fit: bwin.fit.bind(bwin),
      setTheme: bwin.setTheme.bind(bwin),
      addPane,
      removePane,
      updatePane,
    }

    return () => {
      windowContext.windowApi.current = null
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

  return (
    <>
      {memoizedWindowNode}
      {[...paneContentPortals].map(([sashId, { node, container }]) =>
        createPortal(node, container, sashId)
      )}
    </>
  )
})
