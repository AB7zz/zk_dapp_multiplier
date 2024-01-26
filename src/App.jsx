import { WagmiProvider, createConfig, http } from 'wagmi'
import { polygonMumbai } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications';
import { createPublicClient } from 'viem'
import { metaMask, injected } from 'wagmi/connectors';
import HomePage from './HomePage';
import './App.css'

const queryClient = new QueryClient() 

export const config = createConfig({
  chains: [polygonMumbai],
  connectors: [injected()],
  transports: {
    [polygonMumbai.id]: http()
  }
})

function App() {

  return (
    <WagmiProvider config={config}> 
      <QueryClientProvider client={queryClient}>
        <MantineProvider withNormalizeCSS>
          <Notifications />
          <HomePage />
        </MantineProvider>
      </QueryClientProvider>
    </WagmiProvider> 
  )
}

export default App
