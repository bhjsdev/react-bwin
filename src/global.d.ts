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
    label?: string
    className?: string
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

  interface BinaryWindow {
    new (settings: ConfigRoot): BinaryWindow
    rootSash: Sash
    windowElement: HTMLElement
    containerElement: HTMLElement
    sillElement: HTMLElement
    theme: string
    actions: [Action[], Action[]]
    mount(container: HTMLElement): void
    enableFeatures(): void
    fit(): void
    addPane(targetPaneId: string, fields: PaneFields): Sash
    removePane(targetPaneId: string): void
    setTheme(theme: string): void
  }

  type WindowApi = {
    addPane: (targetPaneId: string, fields: PaneFields) => void
    removePane: (targetPaneId: string) => void
    fit: () => void
    setTheme: (theme: string) => void
  }

  /**
   * @deprecated Use {@link WindowApi} instead.
   */
  type WindowHandle = WindowApi

  type WindowProps = Omit<ConfigRoot, 'children'> & {
    panes?: ConfigNode[]
  }

  type PaneFields = {
    size?: number | string
    position?: Position
    title?: React.ReactNode
    content?: React.ReactNode
    actions?: Actions
    draggable?: boolean
    droppable?: boolean
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
