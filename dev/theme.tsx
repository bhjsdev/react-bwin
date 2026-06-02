import React, { useRef, useState } from 'react'
import { Window } from '../src'

const content = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.`

// Native form elements to verify `color-scheme: dark` is applied.
const inputs = (
  <form>
    <input type="text" placeholder="Text input" />
    <input type="number" defaultValue={42} />
    <input type="date" />
    <input type="range" />
    <select>
      <option>Option 1</option>
      <option>Option 2</option>
    </select>
    <textarea placeholder="Textarea" />
    <label>
      <input type="checkbox" defaultChecked /> Checkbox
    </label>
    <button type="button">Button</button>
  </form>
)

export default function App() {
  const windowRef = useRef<WindowHandle>(null)
  const [themeInput, setThemeInput] = useState('dark')

  function toggleTheme() {
    // Read current theme off the rendered element and flip it.
    const current = document.querySelector('bw-window')?.getAttribute('theme')
    windowRef.current?.setTheme(current === 'dark' ? 'light' : 'dark')
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    windowRef.current?.setTheme(themeInput.trim())
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Theme</h2>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <form onSubmit={handleSubmit} style={{ display: 'inline' }}>
        <input
          type="text"
          placeholder="Theme name"
          value={themeInput}
          onChange={(e) => setThemeInput(e.target.value)}
        />
        <button type="submit">Set Theme</button>
      </form>
      <div style={{ width: 444, height: 333, marginTop: 12 }}>
        <Window
          ref={windowRef}
          fitContainer
          theme="dark"
          panes={[
            { position: 'left', size: '40%', content },
            {
              position: 'right',
              children: [
                { position: 'top', size: '30%', content },
                { position: 'bottom', size: '70%', content: inputs },
              ],
            },
          ]}
        />
      </div>
    </div>
  )
}
