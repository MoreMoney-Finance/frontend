import * as React from 'react';
import { ChakraProvider, Box, VStack, Grid } from '@chakra-ui/react';
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
              <Box maxWidth="1200px" margin="0 auto" px={4}>
                <NotificationsComponent />
                <NavigationBar />
                <Grid minH="100vh">
                  <VStack spacing={8}>
                    {params.children}
                    <Outlet />
                  </VStack>
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
