import React from 'react'
import { WindowProvider, useWindow } from '../src'

export default function App() {
  return (
    <WindowProvider>
      <Main />
    </WindowProvider>
  )
}

function Main() {
  const { addWindowlessGlass } = useWindow()

  // Static method: floats on document.body, not inside any bw-window.
  function handleBasic() {
    addWindowlessGlass({
      title: 'Windowless glass',
      content: <div style={{ padding: 8 }}>windowless</div>,
    })
  }

  // Modal: a backdrop is appended behind the glass to block everything underneath.
  function handleModal() {
    addWindowlessGlass({
      modal: true,
      title: 'Modal windowless glass',
      content: <div style={{ padding: 8 }}>modal</div>,
    })
  }

  // Placed relative to the body's top-left via offsetX/offsetY.
  function handlePositioned() {
    addWindowlessGlass({
      title: 'Positioned windowless glass',
      position: 'top-left',
      offsetX: 120,
      offsetY: 80,
      content: <div style={{ padding: 8 }}>positioned</div>,
    })
  }

  // Windowless glass filling the viewport with a 20px inset on every edge.
  // A fullscreen popup shouldn't be resized, so `resizable: false` suppresses the handles.
  function handleFullscreen() {
    const EDGE = 20
    addWindowlessGlass({
      title: 'Fullscreen popup',
      draggable: false,
      resizable: false,
      position: 'top-left',
      offset: EDGE,
      width: document.documentElement.clientWidth - EDGE * 2,
      height: document.documentElement.clientHeight - EDGE * 2,
      content: <div style={{ padding: 8 }}>fullscreen</div>,
    })
  }

  // `resizable: false` keeps resize handles from ever appearing on hover.
  function handleNonResizable() {
    addWindowlessGlass({
      title: 'Non-resizable glass',
      resizable: false,
      content: <div style={{ padding: 8 }}>non-resizable</div>,
    })
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Windowless glass</h2>
      <button onClick={handleBasic}>Add windowless</button>
      <button onClick={handleModal}>Add modal</button>
      <button onClick={handlePositioned}>Add positioned</button>
      <button onClick={handleFullscreen}>Add fullscreen</button>
      <button onClick={handleNonResizable}>Add non-resizable</button>
    </div>
  )
}
