import * as React from 'react';
import {
  ChakraProvider,
  Box,
  VStack,
  Grid,
  extendTheme,
  ThemeConfig,
  GridItem,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './components/ColorModeSwitcher';
import ConnectButton from './components/ConnectButton';
import { UserAddressCtxProvider } from './contexts/UserAddressContext';
import { WalletBalancesCtxProvider } from './contexts/WalletBalancesContext';
import { StrategyMetadataCtxProvider } from './contexts/StrategyMetadataContext';
import { Outlet } from 'react-router-dom';
import { UserBalanceComponent } from './components/WalletBalance';

const config: ThemeConfig = {
  initialColorMode: 'dark',
};

const theme = extendTheme({ config });

export const App = (params: React.PropsWithChildren<unknown>) => (
  <ChakraProvider theme={theme}>
    <UserAddressCtxProvider>
      <WalletBalancesCtxProvider>
        <StrategyMetadataCtxProvider>
          <Box textAlign="center" fontSize="xl">
            <Grid minH="100vh" p={3}>
              <GridItem justifySelf={'flex-end'}>
                <ColorModeSwitcher />
                <UserBalanceComponent />
              </GridItem>
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
