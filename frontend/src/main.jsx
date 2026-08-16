import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.jsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes default
      gcTime: 1000 * 60 * 30, // 30 minutes garbage collection
      refetchOnWindowFocus: true, // Only fetch on focus if stale
      refetchOnMount: true,
      retry: (failureCount, error) => {
        // Don't retry 401, 403, 404
        if (error.response?.status === 401 || error.response?.status === 403 || error.response?.status === 404) {
          return false;
        }
        return failureCount < 2; // Default retry twice for network/500 errors
      },
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
