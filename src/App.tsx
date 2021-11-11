import * as React from 'react';
import { ChakraProvider, Box, VStack, theme, Grid } from '@chakra-ui/react';
import { ColorModeSwitcher } from './components/ColorModeSwitcher';
import { IsolatedLending } from './components/IsolatedLending';
import ConnectButton from './components/ConnectButton';
import { UserAddressCtxProvider } from './contexts/UserAddressContext';
import { WalletBalancesCtxProvider } from './contexts/WalletBalancesContext';
import { WrapNativeCurrency } from './components/WrapNativeCurrency';
import { StrategyMetadataCtxProvider } from './contexts/StrategyMetadataContext';

export const App = () => (
  <ChakraProvider theme={theme}>
    <UserAddressCtxProvider>
      <WalletBalancesCtxProvider>
        <StrategyMetadataCtxProvider>
          <Box textAlign="center" fontSize="xl">
            <Grid minH="100vh" p={3}>
              <ColorModeSwitcher justifySelf="flex-end" />
              <VStack spacing={8}>
                <ConnectButton />
                <IsolatedLending />
                <WrapNativeCurrency />
              </VStack>
            </Grid>
          </Box>
        </StrategyMetadataCtxProvider>
      </WalletBalancesCtxProvider>
    </UserAddressCtxProvider>
  </ChakraProvider>
);
