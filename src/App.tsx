import * as React from "react";
import { ChakraProvider, Box, VStack, theme, Grid } from "@chakra-ui/react";
import { ColorModeSwitcher } from "./components/ColorModeSwitcher";
import { IsolatedLending } from "./components/IsolatedLending";
import ConnectButton from "./components/ConnectButton";

export const App = () => (
  <ChakraProvider theme={theme}>
    <Box textAlign="center" fontSize="xl">
      <Grid minH="100vh" p={3}>
        <ColorModeSwitcher justifySelf="flex-end" />
        <VStack spacing={8}>
          <ConnectButton />
          <IsolatedLending />
        </VStack>
      </Grid>
    </Box>
  </ChakraProvider>
);
