import { ColorModeScript } from '@chakra-ui/react';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './serviceWorker';
import { ChainId, DAppProvider } from '@usedapp/core';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import TokenPage from './pages/TokenPage';
import FarmPage from './pages/Farm';
import PositionsPage from './pages/Positions';
import LiquidationProtectedLoans from './pages/Loans';
import Analytics from './pages/Analytics';
import LiquidatablePositions from './pages/LiquidatablePositions';
import XMorePage from './pages/XMore';

ReactDOM.render(
  <React.StrictMode>
    <ColorModeScript />
    <DAppProvider
      config={{
        supportedChains: [ChainId.Avalanche, ChainId.Hardhat],
        readOnlyChainId: ChainId.Avalanche,
        readOnlyUrls: {
          [ChainId.Avalanche]: 'https://api.avax.network/ext/bc/C/rpc',
        },
        multicallAddresses: {
          [ChainId.Hardhat]: '0x0FB54156B496b5a040b51A71817aED9e2927912E',
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Dashboard />} />
            <Route path="/token/:tokenAddress" element={<TokenPage />} />
            <Route path="/farm" element={<FarmPage />} />
            <Route path="/positions" element={<PositionsPage />} />
            <Route
              path="/liquidatable-positions"
              element={<LiquidatablePositions />}
            />
            <Route path="/loans" element={<LiquidationProtectedLoans />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/xmore" element={<XMorePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DAppProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
