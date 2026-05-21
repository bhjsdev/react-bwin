import { useRef, useState } from 'react'
import { Window, BUILTIN_ACTIONS } from 'react-bwin'
import 'react-bwin/react-bwin.css'

const files = [
  { name: 'src/', type: 'dir' },
  { name: '  App.tsx', type: 'file' },
  { name: '  main.tsx', type: 'file' },
  { name: '  utils.ts', type: 'file' },
  { name: 'package.json', type: 'file' },
  { name: 'tsconfig.json', type: 'file' },
  { name: 'vite.config.ts', type: 'file' },
]

function FileExplorer() {
  return (
    <div className="file-explorer">
      <div className="file-explorer-header">EXPLORER</div>
      <ul className="file-tree">
        {files.map((f) => (
          <li key={f.name} className={`file-item file-item--${f.type}`}>
            <span className="file-icon">{f.type === 'dir' ? '\u{1F4C1}' : '\u{1F4C4}'}</span>
            {f.name}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Editor({ filename }: { filename: string }) {
  const lines = [
    `import { defineConfig } from 'vite'`,
    `import react from '@vitejs/plugin-react'`,
    ``,
    `export default defineConfig({`,
    `  plugins: [react()],`,
    `})`,
  ]

  return (
    <div className="editor">
      <div className="editor-lines">
        {lines.map((line, i) => (
          <div key={i} className="editor-line">
            <span className="line-number">{i + 1}</span>
            <span className="line-content">{line}</span>
          </div>
        ))}
      </div>
      <div className="editor-status">
        {filename} &middot; TypeScript &middot; UTF-8
      </div>
    </div>
  )
}

function Terminal() {
  const lines = [
    '$ pnpm dev',
    '',
    '  VITE v8.0.13  ready in 120 ms',
    '',
    '  ➡  Local:   http://localhost:5173/',
    '  ➡  Network: use --host to expose',
    '  ➡  press h + enter to show help',
  ]

  return (
    <div className="terminal">
      <div className="terminal-content">
        {lines.map((line, i) => (
          <div key={i} className="terminal-line">{line}</div>
        ))}
        <div className="terminal-line terminal-cursor">$&nbsp;</div>
      </div>
    </div>
  )
}

let paneCounter = 0

export default function App() {
  const windowRef = useRef<WindowHandle>(null)
  const [status, setStatus] = useState('Ready')

  function handleAddTab() {
    paneCounter++
    const name = `new-file-${paneCounter}.ts`
    windowRef.current?.addPane('editor-1', {
      position: 'right',
      size: 0.5,
      title: name,
      content: <Editor filename={name} />,
      draggable: true,
      droppable: true,
    })
    setStatus(`Added tab: ${name}`)
  }

  return (
    <div className="ide-container">
      <div className="ide-toolbar">
        <span className="ide-title">react-bwin IDE Example</span>
        <button className="ide-btn" onClick={handleAddTab}>+ New Tab</button>
        <span className="ide-status">{status}</span>
      </div>
      <div className="ide-window">
        <Window
          ref={windowRef}
          fitContainer
          panes={[
            {
              id: 'sidebar',
              position: 'left',
              size: '220px',
              title: 'Explorer',
              content: <FileExplorer />,
              actions: null,
              draggable: false,
              droppable: false,
            },
            {
              position: 'right',
              children: [
                {
                  position: 'top',
                  size: '70%',
                  children: [
                    {
                      id: 'editor-1',
                      position: 'left',
                      size: '50%',
                      title: 'App.tsx',
                      content: <Editor filename="App.tsx" />,
                      actions: [...BUILTIN_ACTIONS],
                      draggable: true,
                      droppable: true,
                    },
                    {
                      id: 'editor-2',
                      position: 'right',
                      size: '50%',
                      title: 'main.tsx',
                      content: <Editor filename="main.tsx" />,
                      actions: [...BUILTIN_ACTIONS],
                      draggable: true,
                      droppable: true,
                    },
                  ],
                },
                {
                  id: 'terminal',
                  position: 'bottom',
                  size: '30%',
                  title: 'Terminal',
                  content: <Terminal />,
                  actions: [...BUILTIN_ACTIONS],
                  draggable: true,
                  droppable: true,
                },
              ],
            },
          ]}
        />
      </div>
    </div>
  )
}
