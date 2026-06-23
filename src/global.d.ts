declare module 'react-bwin' {
  export const BUILTIN_ACTIONS: Action[]
  export const DEFAULT_GLASS_ACTIONS: Action[]
  export const DEFAULT_DETACHED_GLASS_ACTIONS: Action[]
  export const Window: React.ForwardRefExoticComponent<
    WindowProps & React.RefAttributes<WindowApi>
  >
  export const WindowProvider: React.FunctionComponent<
    React.PropsWithChildren<{}>
  >
  export function useWindow(): WindowApi
}

declare global {
  type Position = 'left' | 'right' | 'top' | 'bottom'

  type Action = {
    id?: string
    label?: string
    className?: string
    placement?: 'list' | 'menu'
    onClick: (
      event: React.MouseEvent<HTMLButtonElement>,
      bwin: BinaryWindow
    ) => void
  }

  type Actions = undefined | null | Action[]

  interface Sash {
    id: string
    position: Position
    left: number
    top: number
    width: number
    height: number
    minWidth: number
    minHeight: number
    children: Sash[]
    domNode?: HTMLElement
    leftChild?: Sash
    rightChild?: Sash
    topChild?: Sash
    bottomChild?: Sash
    store?: {
      actions?: Actions
      droppable?: boolean
      draggable?: boolean
      title?: any
      content?: any
      resizable?: boolean
    }
    walk(callback: (sash: Sash) => void): void
  }

  type ConfigNode = {
    id?: string
    size?: number | string
    position?: Position
    title?: React.ReactNode
    content?: React.ReactNode
    actions?: Actions
    children?: ConfigNode[]
    draggable?: boolean
    droppable?: boolean
  }

  type ConfigRoot = {
    id?: string
    width?: number
    height?: number
    fitContainer?: boolean
    theme?: string
    actions?: Actions | [Actions, Actions?]
    title?: React.ReactNode
    content?: React.ReactNode
    children?: ConfigNode[]
  }

  type PaneFields = {
    id?: string
    size?: number | string
    position?: Position
    title?: React.ReactNode
    content?: React.ReactNode
    actions?: Actions
    draggable?: boolean
    droppable?: boolean
  }

  type UpdatePaneOptions = Omit<PaneFields, 'id' | 'actions'>

  type WindowlessGlassPosition =
    | 'center'
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'

  type WindowlessGlassOptions = {
    modal?: boolean
    position?: WindowlessGlassPosition
    width?: number
    height?: number
    offset?: number
    offsetX?: number
    offsetY?: number
    id?: string
    actions?: Actions
    title?: React.ReactNode
    content?: React.ReactNode
    tabs?: object[]
    draggable?: boolean
    resizable?: boolean
    animateOpen?: boolean
  }

  type RemoveWindowlessGlassOptions = {
    animateClose?: boolean
  }

  interface BinaryWindow {
    new(settings: ConfigRoot): BinaryWindow
    rootSash: Sash
    windowElement: HTMLElement
    containerElement: HTMLElement
    sillElement: HTMLElement
    theme: string
    actions: [Action[], Action[]]
    mount(container: HTMLElement): void
    enableFeatures(): void
    fit(): void
    addPane(targetPaneSashId: string, fields: PaneFields): Sash
    updatePane(sashId: string, fields: UpdatePaneOptions): void
    removePane(sashId: string): void
    setTheme(theme: string): void
    addWindowlessGlass(options?: WindowlessGlassOptions): HTMLElement
    removeWindowlessGlass(
      windowlessGlassId: string,
      options?: RemoveWindowlessGlassOptions
    ): HTMLElement | null
  }

  type WindowApi = {
    addPane: (targetPaneSashId: string, fields: PaneFields) => void
    updatePane: (sashId: string, fields: UpdatePaneOptions) => void
    removePane: (sashId: string) => void
    fit: () => void
    setTheme: (theme: string) => void
  }

  // Windowless glass lives on the WindowProvider (static BinaryWindow methods,
  // no owning window), so its API is separate from the per-Window WindowApi.
  type WindowlessGlassApi = {
    addWindowlessGlass: (options?: WindowlessGlassOptions) => HTMLElement
    removeWindowlessGlass: (
      windowlessGlassId: string,
      options?: RemoveWindowlessGlassOptions
    ) => HTMLElement | null
  }

  /**
   * @deprecated Use {@link WindowApi} instead.
   */
  type WindowHandle = WindowApi

  type WindowProps = Omit<ConfigRoot, 'children'> & {
    panes?: ConfigNode[]
  }

}

export {
  Position,
  Action,
  Actions,
  Sash,
  ConfigNode,
  ConfigRoot,
  BinaryWindow,
  WindowProps,
}
