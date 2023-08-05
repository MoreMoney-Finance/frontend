import { Box, ChakraProvider, Container } from '@chakra-ui/react';
import { useConfig, useEthers } from '@usedapp/core';
import { ethers } from 'ethers';
import * as React from 'react';
import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import robotIcon from './assets/img/Robot.png';
import { useAddresses } from './chain-interaction/contracts';
import Footer from './components/navigation/Footer';
import MobileMenu from './components/navigation/MobileMenu';
import NavigationBar from './components/navigation/NavigationBar';
import GlobalDebtCeilingMessage from './components/notifications/GlobalDebtCeilingMessage';
import NetworkNotSupported from './components/notifications/NetworkNotSupported';
import PhishingAlertComponent from './components/notifications/PhishingAlertComponent';
import { TransactionToasts } from './components/notifications/TransactionToasts';
import { ExternalMetadataCtxProvider } from './contexts/ExternalMetadataContext';
import { LiquidationFeesCtxProvider } from './contexts/LiquidationFeesContext';
import MakeMostOfMoneyCtxProvider from './contexts/MakeMostOfMoneyContext';
import { StrategyMetadataCtxProvider } from './contexts/StrategyMetadataContext';
import { UserAddressCtxProvider } from './contexts/UserAddressContext';
import { WalletBalancesCtxProvider } from './contexts/WalletBalancesContext';
import './index.css';
import { theme } from './theme';

declare let window: any;

export const App = (params: React.PropsWithChildren<unknown>) => {
  const addresses = useAddresses();
  const { active, chainId, activateBrowserWallet, account } = useEthers();
  // const chainIdsList = [31337, 43114];
  const config = useConfig();
  const chainIdsList = config.networks!.map((network) => network.chainId);

  const [requestedSwitch, setRequestedSwitch] = React.useState(false);
  const [tabHasFocus, setTabHasFocus] = React.useState(true);

  useEffect(() => {
    (async () => {
      const wallet = new ethers.providers.Web3Provider(window.ethereum);
      const { chainId: walletChainId } = await wallet.getNetwork();
      const accounts = await wallet.listAccounts();

      if (chainId === 31337) {
        activateBrowserWallet();
      }

      if (
        accounts.length > 0 &&
        !requestedSwitch &&
        walletChainId &&
        !chainIdsList.includes(walletChainId) &&
        tabHasFocus
      ) {
        setRequestedSwitch(true);
        try {
          await wallet.provider.request!({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xa86a' }],
          });
          activateBrowserWallet();
        } catch (switchError) {
          try {
            await wallet.provider.request!({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0xa86a',
                  chainName: 'Avalanche Network',
                  nativeCurrency: {
                    name: 'avax',
                    symbol: 'AVAX',
                    decimals: 18,
                  },
                  rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
                  blockExplorerUrls: ['https://snowtrace.io/'],
                },
              ],
            });
            activateBrowserWallet();
          } catch (addError) {
            alert(
              `Your wallet may be connected to an unsupported network. Please manually switch to a supported network: ${addError}`
            );
          }
        }
      } else if (accounts.length > 0 && !account) {
        activateBrowserWallet();
      }
    })();
  }, [active, chainId, tabHasFocus]);

  const location = useLocation();
  useEffect(() => window.scrollTo(0, 0), [location]);

  useEffect(() => {
    const handleFocus = () => {
      if (document.visibilityState == 'visible') {
        setTabHasFocus(true);
        console.log('tab is active');
      } else {
        setTabHasFocus(false);
        console.log('tab is inactive');
      }
    };

    document.addEventListener('visibilitychange', handleFocus);

    return () => {
      window.removeEventListener('visibilitychange', handleFocus);
    };
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <UserAddressCtxProvider>
        <WalletBalancesCtxProvider>
          <LiquidationFeesCtxProvider>
            <ExternalMetadataCtxProvider>
              {addresses ? (
                <>
                  <PhishingAlertComponent />
                  <Box
                    maxWidth="1280px"
                    margin="0 auto"
                    px={4}
                    minHeight={'100vh'}
                  >
                    {/* ROBOT IMAGE */}
                    <Container
                      width="641px"
                      height="627.497px"
                      maxWidth="100vw"
                      position="absolute"
                      top="100px"
                      left="0px"
                      zIndex="-1"
                      display={['none', 'none', 'block']}
                      backgroundImage={`url(${robotIcon})`}
                      backgroundPosition="left"
                      backgroundRepeat="no-repeat"
                    />

                    {/* ROBOT IMAGE MOBILE */}
                    <Container
                      width="441px"
                      height="627.497px"
                      maxWidth="100vw"
                      position="absolute"
                      top="-70px"
                      left="-40px"
                      zIndex="-1"
                      display={['block', 'block', 'none']}
                      backgroundImage={`url(${robotIcon})`}
                      backgroundPosition="left"
                      backgroundSize="100%"
                      backgroundRepeat="no-repeat"
                    />

                    <StrategyMetadataCtxProvider>
                      <MakeMostOfMoneyCtxProvider>
                        <TransactionToasts />
                        <ToastContainer />
                        <NavigationBar />
                        <br />
                        <GlobalDebtCeilingMessage />
                        {/* <MigratePositionsComponent /> */}
                        {/* <LiquidatablePositionsMessage /> */}
                        <Box paddingBottom={'70px'}>
                          {params.children}
                          <Outlet />
                        </Box>
                      </MakeMostOfMoneyCtxProvider>
                    </StrategyMetadataCtxProvider>
                    <Footer />
                    <MobileMenu />
                  </Box>
                </>
              ) : (
                <NetworkNotSupported />
              )}
            </ExternalMetadataCtxProvider>
          </LiquidationFeesCtxProvider>
        </WalletBalancesCtxProvider>
      </UserAddressCtxProvider>
    </ChakraProvider>
  );
};
