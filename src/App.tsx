import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ViewPage } from './pages/ViewPage';
import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@mysten/dapp-kit/dist/index.css';

// Config options for the networks you want to connect to
const { networkConfig } = createNetworkConfig({
	mainnet: { url: getFullnodeUrl('mainnet') },
});
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
			<SuiClientProvider networks={networkConfig} defaultNetwork="mainnet">
				<WalletProvider>
					<Router>
						<Routes>
							<Route path="/view/:id" element={<ViewPage />} />
						</Routes>
					</Router>
				</WalletProvider>
			</SuiClientProvider>
		</QueryClientProvider>
	);
}

export default App;
