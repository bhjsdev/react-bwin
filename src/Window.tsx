import React, {
  useRef,
  useEffect,
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
import 'bwin/bwin.css'

export default forwardRef<WindowHandle, WindowProps>((props, ref) => {
  const windowRef = useRef<HTMLElement>()
  const sillRef = useRef<HTMLElement>()
  const [paneContentPortals, setPaneContentPortals] =
    useState<{ node: ReactNode; container: HTMLElement }[]>()

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

  useImperativeHandle(
    ref,
    () => ({
      fit: bwin.fit.bind(bwin),
      removePane: bwin.removePane.bind(bwin),
      addPane,
    }),
    []
  )

  const windowNode = (
    <bw-window
      root-sash-id={bwin.rootSash.id}
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

  function addPane(targetPaneId: string, fields: PaneFields) {
    const { content, ...restFields } = fields
    const sash = bwin.addPane(targetPaneId, restFields)
    const glassContentEl = document.querySelector(
      `bw-pane[sash-id="${sash.id}"] bw-glass-content`
    )
    setPaneContentPortals((prev) => [
      ...(prev || []),
      { node: content, container: glassContentEl as HTMLElement },
    ])
  }

  return (
    <>
      {memoizedWindowNode}
      {paneContentPortals?.map((portal) => {
        return createPortal(portal.node, portal.container)
      })}
    </>
  )
})
