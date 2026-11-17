import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { DemoProvider } from './contexts/DemoContext'
import { EmployeeProvider } from './contexts/EmployeeContext'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><BrowserRouter><DemoProvider><EmployeeProvider><App /></EmployeeProvider></DemoProvider></BrowserRouter></React.StrictMode>,
)
