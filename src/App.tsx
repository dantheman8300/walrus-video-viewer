import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ViewPage } from './pages/ViewPage';
import { UploadPage } from './pages/UploadPage';
import { MyVideosPage } from './pages/MyVideosPage';
import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from './components/Header';
import '@mysten/dapp-kit/dist/index.css';
import { Analytics } from "@vercel/analytics/react"


// Config options for the networks you want to connect to
const { networkConfig } = createNetworkConfig({
	mainnet: { url: getFullnodeUrl('mainnet') },
});
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
			<SuiClientProvider networks={networkConfig} defaultNetwork="mainnet">
				<WalletProvider autoConnect={true}>
					<Router>
						<Analytics />
						<Header />
						<Routes>
							<Route path="/view/:id" element={<ViewPage />} />
							<Route path="/upload" element={<UploadPage />} />
							<Route path="/myvideos" element={<MyVideosPage />} />
						</Routes>
					</Router>
				</WalletProvider>
			</SuiClientProvider>
		</QueryClientProvider>
	);
}

export default App;
