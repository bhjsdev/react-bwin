import React, { createContext, useContext, useState, ReactNode } from 'react'

const ContentContext = createContext<{
  content: any
  updateContent: (node: ReactNode) => void
}>({ content: null, updateContent: () => {} })

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ReactNode>(null)

  const updateContent = (newContent: ReactNode) => {
    setContent(newContent)
  }

  return (
    <ContentContext.Provider value={{ content, updateContent }}>
      {children}
    </ContentContext.Provider>
  )
}

export function useContentAPI() {
  const context = useContext(ContentContext)

  if (!context) {
    throw new Error('useContentAPI must be used within a ContentProvider')
  }
  return context
}
