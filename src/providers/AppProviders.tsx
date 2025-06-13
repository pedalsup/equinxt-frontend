import type { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { store, persistor } from '../redux/store'
import { BrowserRouter } from 'react-router'
import { PersistGate } from 'redux-persist/integration/react'

const queryClient = new QueryClient()

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            {children}
          </BrowserRouter>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  )
}
