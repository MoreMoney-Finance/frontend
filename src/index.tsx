import { ColorModeScript } from '@chakra-ui/react';
import {
  Avalanche,
  ChainId,
  DAppProvider,
  Hardhat,
  Localhost,
} from '@usedapp/core';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { App } from './App';
import { LiquidatablePositionsCtxProvider } from './contexts/LiquidatablePositionsContext';
import AdminPage from './pages/Admin';
import Analytics from './pages/Analytics';
import Dashboard from './pages/Dashboard';
import { ErrorBoundary } from './pages/ErrorBoundary/ErrorBoundary';
import FarmPage from './pages/Farm';
import LiquidatablePositions from './pages/LiquidatablePositions';
import LiquidationProtectedLoans from './pages/Loans';
import PositionsPage from './pages/Positions';
import StakePage from './pages/Stake';
import TokenPage from './pages/TokenPage';
import VeMoreTokenPage from './pages/vMore';
import XMorePage from './pages/XMore';
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <ColorModeScript />
    <DAppProvider
      config={{
        networks: [Avalanche, Hardhat, Localhost],
        readOnlyChainId: ChainId.Avalanche,
        readOnlyUrls: {
          [ChainId.Avalanche]: 'https://api.avax.network/ext/bc/C/rpc',
          [ChainId.Localhost]: 'http://localhost:8545',
          [ChainId.Hardhat]: 'http://localhost:8545',
        },
        multicallAddresses: {
          [ChainId.Localhost]: '0x0FB54156B496b5a040b51A71817aED9e2927912E',
          [ChainId.Hardhat]: '0x0FB54156B496b5a040b51A71817aED9e2927912E',
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<Dashboard />} />
            <Route
              path="/token/:tokenAddress"
              element={
                <ErrorBoundary>
                  <TokenPage />
                </ErrorBoundary>
              }
            />
            <Route path="/farm" element={<FarmPage />} />
            <Route path="/positions" element={<PositionsPage />} />
            <Route
              path="/liquidatable-positions"
              element={
                <LiquidatablePositionsCtxProvider>
                  <LiquidatablePositions />
                </LiquidatablePositionsCtxProvider>
              }
            />
            <Route path="/loans" element={<LiquidationProtectedLoans />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/stake" element={<StakePage />} />
            <Route path="/xmore" element={<XMorePage />} />
            <Route path="/vmore" element={<VeMoreTokenPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/:positions" element={<AdminPage />} />
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
