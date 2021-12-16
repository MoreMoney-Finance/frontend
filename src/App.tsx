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

export const App = (params: React.PropsWithChildren<unknown>) => {
  const addresses = useAddresses();

  return (
    <ChakraProvider theme={theme}>
      <UserAddressCtxProvider>
        <WalletBalancesCtxProvider>
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
        </WalletBalancesCtxProvider>
      </UserAddressCtxProvider>
    </ChakraProvider>
  );
};
