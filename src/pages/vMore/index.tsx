import { Box, Flex, Grid, Text } from '@chakra-ui/react';
import * as React from 'react';
import { EditMoreVeMoreToken } from './edit/EditMoreVeMore';
import { MoreBalanceVeMoreToken } from './metadata/MoreBalanceVeMore';
import { StakingAPRVeMoreToken } from './metadata/StakingAPRVeMore';

export default function veMorePage(props: React.PropsWithChildren<unknown>) {
  return (
    <Flex flexDirection={'column'} margin={'110px'}>
      <Box textAlign="center" margin="0px 10px 50px 10px">
        <Text fontSize={['36', '48', '48']} lineHeight="56px">
          <b>Maximize yield by staking MORE for veMore</b>
        </Text>
      </Box>
      <Grid
        templateColumns={['repeat(1, 1fr)', 'repeat(5, 1fr)', '460px auto']}
        templateRows={['repeat(2, 1fr)', 'repeat(2, 1fr)', '100px auto']}
        w={'full'}
        gap={'20px'}
        marginTop={'30px'}
      >
        <MoreBalanceVeMoreToken />
        <EditMoreVeMoreToken />
        <StakingAPRVeMoreToken />
      </Grid>
      {props.children}
    </Flex>
  );
}
