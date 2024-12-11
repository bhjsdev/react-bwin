import React from 'react'
import ReactDOM from 'react-dom'
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  NavLink,
} from 'react-router-dom'
import './index.css'

const links = [
  'adhoc',
  'memoized',
  'fit-container',
  'window-ref',
  'docs-example',
].sort()

const rootKidsPromises = links.map(async (link) => {
  const module = await import(/* @vite-ignore */ `./${link}`)

  // Vite dev server requires dot(.) for fallback to index page
  // https://vitejs.dev/guide/features.html#dynamic-import-polyfill
  return {
    path: `${link}.html`,
    Component: module.default,
  }
})

const rootKids = await Promise.all(rootKidsPromises)

function Root() {
  return (
    <div className="_container">
      <ul className="_menu">
        {links.map((link) => (
          <li key={link}>
            <NavLink
              to={`/${link}.html`}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {link}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="_content">
        <Outlet />
      </div>
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: rootKids,
  },
])

ReactDOM.render(
  <RouterProvider router={router} />,
  document.getElementById('root')
)
