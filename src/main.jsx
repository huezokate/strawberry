import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import StrawberrySolitaire from '../strawbberry.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StrawberrySolitaire />
  </StrictMode>
)
