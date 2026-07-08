declare module 'bwin' {
  export const BUILTIN_ACTIONS: Action[]
  export const DEFAULT_GLASS_ACTIONS: Action[]
  export const DEFAULT_DETACHED_GLASS_ACTIONS: Action[]
  export const BinaryWindow: BinaryWindow

  interface DetachedGlassManager {
    detachedGlassElements: HTMLElement[]
    topZIndex: number
    setBaseZIndex(zIndex: number): void
    addDetachedGlass(options?: DetachedGlassOptions): HTMLElement
    getDetachedGlassById(id: string): HTMLElement | null
    getActiveDetachedGlass(): HTMLElement | null
    bringToFront(glassEl: HTMLElement): number | undefined
    removeDetachedGlass(id: string): HTMLElement | null
    updateDetachedGlass(id: string, options: DetachedGlassOptions): never
  }

  export const detachedGlassManager: DetachedGlassManager
}

declare namespace JSX {
  interface IntrinsicElements {
    'bw-window': React.DetailedHTMLProps<any, HTMLElement>
    'bw-pane': React.DetailedHTMLProps<any, HTMLElement>
    'bw-muntin': React.DetailedHTMLProps<any, HTMLElement>
    'bw-glass': React.DetailedHTMLProps<any, HTMLElement>
    'bw-glass-header': React.DetailedHTMLProps<any, HTMLElement>
    'bw-glass-title': React.DetailedHTMLProps<any, HTMLElement>
    'bw-action-menu': React.DetailedHTMLProps<any, HTMLElement>
    'bw-action-bar': React.DetailedHTMLProps<any, HTMLElement>
    'bw-glass-content': React.DetailedHTMLProps<any, HTMLElement>
    'bw-sill': React.DetailedHTMLProps<any, HTMLElement>
  }
}
