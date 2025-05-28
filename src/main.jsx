import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AIProvider, AIErrorBoundary } from './core/aiHooks.jsx'
import ErrorPage from './components/ErrorPage.jsx'
import './index.css'
import App from './App.jsx'

function TopLevelErrorBoundary({ children }) {
  const [error, setError] = useState(null);

  useEffect(() => {
    const errorHandler = (error) => {
      console.error('Uncaught error:', error);
      setError(error);
    };
    
    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  if (error) {
    return <ErrorPage
      error={error}
      onRetry={() => window.location.reload()}
    />;
  }

  return children;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TopLevelErrorBoundary>
      <BrowserRouter>
        <AIProvider>
          <AIErrorBoundary>
            <App />
          </AIErrorBoundary>
        </AIProvider>
      </BrowserRouter>
    </TopLevelErrorBoundary>
  </StrictMode>,
)
