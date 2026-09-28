import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ExpenseProvider } from './context/ExpenseProvider.jsx'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ExpenseProvider>
      <App />
    </ExpenseProvider>
  </StrictMode>,
)
