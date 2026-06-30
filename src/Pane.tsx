import React, { useRef, useEffect } from 'react'

export default function Pane({
  sash,
  bwin,
}: {
  sash: Sash
  bwin: BinaryWindow
}) {
  const paneRef = useRef()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLElement>()
  const { left, top, width, height, id, position } = sash

  useEffect(() => {
    sash.domNode = paneRef.current
  }, [])

  // Link trigger to menu by element reference once both are mounted.
  useEffect(() => {
    if (triggerRef.current && menuRef.current) {
      triggerRef.current.popoverTargetElement = menuRef.current
    }
  })

  const actions =
    sash.store?.actions === undefined
      ? bwin.actions[0]
      : Array.isArray(sash.store.actions)
        ? sash.store.actions
        : []

  const menuActions = actions.filter(
    (action: Action) => action.placement === 'menu'
  )

  const barActions = actions.filter(
    (action: Action) => action.placement === undefined || action.placement === 'bar'
  )

  return (
    <bw-pane
      sash-id={id}
      position={position}
      style={{ left, top, width, height }}
      can-drop={sash.store?.droppable === false ? 'false' : 'true'}
      ref={paneRef}
    >
      <bw-glass>
        <bw-glass-header
          can-drag={sash.store?.draggable === false ? 'false' : 'true'}
        >
          {menuActions.length > 0 && (
            <>
              <button className="bw-action-menu-trigger" ref={triggerRef} />
              <bw-action-menu popover="auto" ref={menuRef}>
                {menuActions.map((action: Action, key: number) => {
                  const className = action.className
                    ? `bw-action ${action.className}`
                    : 'bw-action'

                  return (
                    <button
                      className={className}
                      key={key}
                      onClick={(event) => {
                        menuRef.current?.hidePopover()
                        action.onClick(event, bwin)
                      }}
                    >
                      {action.label}
                    </button>
                  )
                })}
              </bw-action-menu>
            </>
          )}
          <bw-glass-title>{sash.store?.title}</bw-glass-title>
          {barActions.length > 0 && (
            <bw-action-bar>
              {barActions.map((action: Action, key: number) => {
                const className = action.className
                  ? `bw-action ${action.className}`
                  : 'bw-action'

                return (
                  <button
                    className={className}
                    key={key}
                    onClick={(event) => action.onClick(event, bwin)}
                  >
                    {action.label}
                  </button>
                )
              })}
            </bw-action-bar>
          )}
        </bw-glass-header>
        {/* Content is rendered into here via a portal from Window. */}
        <bw-glass-content />
      </bw-glass>
    </bw-pane>
  )
}
