import * as React from 'react';
import {
  ChakraProvider,
  Box,
  VStack,
  Grid,
  extendTheme,
  ThemeConfig,
} from '@chakra-ui/react';
import ConnectButton from './components/ConnectButton';
import { UserAddressCtxProvider } from './contexts/UserAddressContext';
import { WalletBalancesCtxProvider } from './contexts/WalletBalancesContext';
import { StrategyMetadataCtxProvider } from './contexts/StrategyMetadataContext';
import { Outlet } from 'react-router-dom';
import { NotificationsComponent } from './components/NotificationsComponent';
import NavigationBar from './components/NavigationBar';
import { useAddresses } from './chain-interaction/contracts';
import NetworkNotSupported from './components/NetworkNotSupported';

const config: ThemeConfig = {
  initialColorMode: 'dark',
};

const theme = extendTheme({ config });

export const App = (params: React.PropsWithChildren<unknown>) => {
  const addresses = useAddresses();

  return (
    <ChakraProvider theme={theme}>
      <UserAddressCtxProvider>
        <WalletBalancesCtxProvider>
          {addresses ? (
            <StrategyMetadataCtxProvider>
              <Box textAlign="center" fontSize="xl">
                <NotificationsComponent />
                <NavigationBar />
                <Grid minH="100vh" p={3}>
                  <VStack spacing={8}>
                    <ConnectButton />
                    {params.children}
                    <Outlet />
                  </VStack>
                </Grid>
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
