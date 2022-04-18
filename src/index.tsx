import { ColorModeScript } from '@chakra-ui/react';
import { ChainId, DAppProvider } from '@usedapp/core';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { App } from './App';
import { ErrorBoundary } from './pages/ErrorBoundary/ErrorBoundary';
import PositionsPage from './pages/Positions';
import TokenPage from './pages/TokenPage';
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './serviceWorker';

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
            <Route index element={<PositionsPage />} />
            <Route
              path="/token/:tokenAddress"
              element={
                <ErrorBoundary>
                  <TokenPage />
                </ErrorBoundary>
              }
            />
            <Route path="/positions" element={<PositionsPage />} />
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
