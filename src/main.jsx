import ErrorBoundary from './components/ErrorBoundary';
import { MotionConfig } from 'framer-motion';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary><MotionConfig reducedMotion="user"><App /></MotionConfig></ErrorBoundary>
  </StrictMode>,
)
