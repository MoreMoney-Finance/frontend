import { Box, Text, Button } from "@chakra-ui/react";
import { formatEther } from "@ethersproject/units";
import { useEthers, useEtherBalance } from "@usedapp/core";
import React from "react";

export default function ConnectButton() {
  const { activateBrowserWallet, account } = useEthers();
  const etherBalance = useEtherBalance(account);

  function handleConnectWallet() {
    activateBrowserWallet();
  }

  return account ? (
    <Box sx={{ float: "right" }}>
      <Text>
        {etherBalance && parseFloat(formatEther(etherBalance)).toFixed(3)} ETH
      </Text>
    </Box>
  ) : (
    <Button onClick={handleConnectWallet} sx={{ fontSize: "larger" }}>
      Connect to wallet
    </Button>
  );
}
