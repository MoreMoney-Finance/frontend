import * as React from 'react';
import { ChakraProvider, Box, Grid } from '@chakra-ui/react';
import { UserAddressCtxProvider } from './contexts/UserAddressContext';
import { WalletBalancesCtxProvider } from './contexts/WalletBalancesContext';
import { StrategyMetadataCtxProvider } from './contexts/StrategyMetadataContext';
import { Outlet } from 'react-router-dom';
import { NotificationsComponent } from './components/NotificationsComponent';
import NavigationBar from './components/NavigationBar';
import { useAddresses } from './chain-interaction/contracts';
import NetworkNotSupported from './components/NetworkNotSupported';
import { theme } from './theme';
import FooterBar from './components/FooterBar';
import { LiquidationFeesCtxProvider } from './contexts/LiquidationFeesContext';
import { useEthers } from '@usedapp/core';
import { useEffect } from 'react';
import { ethers } from 'ethers';

declare let window: any;

export const App = (params: React.PropsWithChildren<unknown>) => {
  const addresses = useAddresses();
  const { active, chainId, account } = useEthers();

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    if (active == true && !account) {
      provider.provider.request!({
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
    }
  }, [active, chainId]);

  return (
    <ChakraProvider theme={theme}>
      <UserAddressCtxProvider>
        <WalletBalancesCtxProvider>
          <LiquidationFeesCtxProvider>
            {addresses ? (
              <StrategyMetadataCtxProvider>
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
                  <Grid minH="100vh">
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
          </LiquidationFeesCtxProvider>
        </WalletBalancesCtxProvider>
      </UserAddressCtxProvider>
    </ChakraProvider>
  );
};
