import * as React from 'react';
import { ChakraProvider, Box, VStack, theme, Grid } from '@chakra-ui/react';
import { ColorModeSwitcher } from './components/ColorModeSwitcher';
import ConnectButton from './components/ConnectButton';
import { UserAddressCtxProvider } from './contexts/UserAddressContext';
import { WalletBalancesCtxProvider } from './contexts/WalletBalancesContext';
import { StrategyMetadataCtxProvider } from './contexts/StrategyMetadataContext';
import { Outlet } from 'react-router-dom';

export const App = (params: React.PropsWithChildren<unknown>) => (
  <ChakraProvider theme={theme}>
    <UserAddressCtxProvider>
      <WalletBalancesCtxProvider>
        <StrategyMetadataCtxProvider>
          <Box textAlign="center" fontSize="xl">
            <Grid minH="100vh" p={3}>
              <ColorModeSwitcher justifySelf="flex-end" />
              <VStack spacing={8}>
                <ConnectButton />
                {params.children}
                <Outlet />
              </VStack>
            </Grid>
          </Box>
        </StrategyMetadataCtxProvider>
      </WalletBalancesCtxProvider>
    </UserAddressCtxProvider>
  </ChakraProvider>
);
