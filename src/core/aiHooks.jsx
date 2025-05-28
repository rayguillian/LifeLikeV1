import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { AIController } from './AIController.js';
import ErrorPage from '../components/ErrorPage.jsx';

const AIContext = createContext();

export function AIErrorBoundary({ children }) {
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const handleRetry = () => {
    setError(null);
    setRetryCount(prev => prev + 1);
  };

  if (error) {
    return <ErrorPage
      error={error}
      onRetry={handleRetry}
      retryCount={retryCount}
    />;
  }

  return children;
}

export function AIProvider({ children }) {
  const [ai, setAi] = useState(() => {
    try {
      return new AIController();
    } catch (error) {
      console.error('Failed to initialize AI controller:', error);
      throw error;
    }
  });
  
  const [state, setState] = useState(() => ai?.getCurrentState() || {});
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const resetAI = useCallback(() => {
    try {
      const newAI = new AIController();
      setAi(newAI);
      setState(newAI.getCurrentState());
      setError(null);
      setRetryCount(prev => prev + 1);
    } catch (error) {
      console.error('Failed to reset AI:', error);
      setError(error);
    }
  }, [setAi, setState, setError, setRetryCount]);

  useEffect(() => {
    if (!ai) return;
    
    const handleStateUpdate = (newState) => {
      setState(newState);
    };

    const unsubscribe = ai.subscribe(handleStateUpdate);
    return unsubscribe;
  }, [ai, retryCount, setState]);

  if (error) {
    return <ErrorPage
      error={error}
      onRetry={resetAI}
      retryCount={retryCount}
    />;
  }

  return (
    <AIContext.Provider value={{
      state,
      actions: ai,
      error,
      resetError: () => setError(null)
    }}>
      <AIErrorBoundary>
        {children}
      </AIErrorBoundary>
    </AIContext.Provider>
  );
}

export function useAIState() {
  // Validate hook is called at top level
  if (typeof window !== 'undefined') {
    const hookName = 'useAIState';
    const stack = new Error().stack;
    if (stack && stack.includes('useAIState') && stack.split('useAIState').length > 2) {
      throw new Error(`${hookName} must be called at the top level of a component`);
    }
  }

  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAIState must be used within an AIProvider');
  }
  if (context.error) {
    throw context.error;
  }
  
  return context.state;
}

export function useAIActions() {
  // Validate hook is called at top level
  if (typeof window !== 'undefined') {
    const hookName = 'useAIActions';
    const stack = new Error().stack;
    if (stack && stack.includes('useAIActions') && stack.split('useAIActions').length > 2) {
      throw new Error(`${hookName} must be called at the top level of a component`);
    }
  }

  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAIActions must be used within an AIProvider');
  }
  if (context.error) {
    throw context.error;
  }

  return useMemo(() => ({
    initialize: context.actions.initialize.bind(context.actions),
    progressStory: context.actions.progressStory.bind(context.actions),
    pause: context.actions.pause.bind(context.actions),
    resume: context.actions.resume.bind(context.actions),
    resetError: context.resetError
  }), [context.actions, context.resetError]);
}