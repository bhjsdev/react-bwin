import React, { FunctionComponent } from 'react'
import ReactDOM from 'react-dom'
import './index.css'

const links = [
  'adhoc',
  'update-pane-content',
  'update-pane-content-zustand',
  'fit-container',
  'window-ref',
  'docs-example',
  'add-remove-panes',
  'custom-action',
  're-render',
].sort()

const components: Record<string, FunctionComponent> = {}

for (const link of links) {
  components[link] = (await import(/* @vite-ignore */ `./${link}`)).default
}

function Root() {
  function renderComponent() {
    const name = location.pathname.slice(1).replace('.html', '')

    if (components[name]) {
      return React.createElement(components[name])
    }

    return <h1>Component not found</h1>
  }

  return (
    <div className="_container">
      <ul className="_menu">
        {links.map((link) => (
          <li key={link}>
            <a href={`/${link}.html`}>{link}</a>
          </li>
        ))}
      </ul>
      <div className="_content">{renderComponent()}</div>
    </div>
  )
}

ReactDOM.render(<Root />, document.getElementById('root'))
