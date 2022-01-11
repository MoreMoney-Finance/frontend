import { Box, ChakraProvider, Grid } from '@chakra-ui/react';
import { useConfig, useEthers } from '@usedapp/core';
import { ethers } from 'ethers';
import * as React from 'react';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAddresses } from './chain-interaction/contracts';
import FooterBar from './components/FooterBar';
import GlobalDebtCeilingMessage from './components/GlobalDebtCeilingMessage';
import NavigationBar from './components/NavigationBar';
import NetworkNotSupported from './components/NetworkNotSupported';
import { NotificationsComponent } from './components/NotificationsComponent';
import PhishingAlertComponent from './components/PhishingAlertComponent';
import { LiquidationFeesCtxProvider } from './contexts/LiquidationFeesContext';
import { StrategyMetadataCtxProvider } from './contexts/StrategyMetadataContext';
import { UserAddressCtxProvider } from './contexts/UserAddressContext';
import { WalletBalancesCtxProvider } from './contexts/WalletBalancesContext';
import { YYMetadataCtxProvider } from './contexts/YYMetadataContext';
import { theme } from './theme';

declare let window: any;

export const App = (params: React.PropsWithChildren<unknown>) => {
  const addresses = useAddresses();
  const { active, chainId, activateBrowserWallet, account } = useEthers();
  const config = useConfig();

  const [requestedSwitch, setRequestedSwitch] = React.useState(false);
  useEffect(() => {
    (async () => {
      const wallet = new ethers.providers.Web3Provider(window.ethereum);
      const { chainId: walletChainId } = await wallet.getNetwork();
      const accounts = await wallet.listAccounts();

      if (
        accounts.length > 0 &&
        !requestedSwitch &&
        walletChainId &&
        !config.supportedChains.includes(walletChainId)
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
  }, [active, chainId]);

  return (
    <ChakraProvider theme={theme}>
      <UserAddressCtxProvider>
        <WalletBalancesCtxProvider>
          <LiquidationFeesCtxProvider>
            <YYMetadataCtxProvider>
              {addresses ? (
                <StrategyMetadataCtxProvider>
                  <PhishingAlertComponent />
                  <Box maxWidth="1280px" margin="0 auto" px={4}>
                    <Box
                      position="absolute"
                      left="0"
                      opacity="0.3"
                      width="500px"
                      height="300px"
                      top="300px"
                      filter="blur(200px)"
                      pointerEvents="none"
                      bgGradient="radial(farthest-side, hsla(0, 100%, 64%, 1), hsla(0, 100%, 64%, 0))"
                      zIndex="var(--chakra-zIndices-docked)"
                    />
                    <Box
                      position="absolute"
                      width="350px"
                      height="230px"
                      filter="blur(200px)"
                      opacity="0.3"
                      right="100px"
                      bottom="200px"
                      pointerEvents="none"
                      bgGradient="radial(farthest-side, hsla(169, 100%, 46%, 1), hsla(169, 100%, 46%, 0))"
                      zIndex="var(--chakra-zIndices-base)"
                    />
                    <NotificationsComponent />
                    <NavigationBar />
                    <br />
                    <GlobalDebtCeilingMessage />
                    <Grid minH="60vh">
                      <Box>
                        {params.children}
                        <Outlet />
                      </Box>
                    </Grid>
                    <FooterBar />
                  </Box>
                </StrategyMetadataCtxProvider>
              ) : (
                <NetworkNotSupported />
              )}
            </YYMetadataCtxProvider>
          </LiquidationFeesCtxProvider>
        </WalletBalancesCtxProvider>
      </UserAddressCtxProvider>
    </ChakraProvider>
  );
};
