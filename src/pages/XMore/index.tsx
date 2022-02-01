import { Box, Container, Flex, Grid, Text } from '@chakra-ui/react';
import * as React from 'react';
import { EditMore } from './edit/EditMore';
import { MoreBalance } from './metadata/MoreBalance';
import { StakingAPR } from './metadata/StakingAPR';

export default function XMorePage(props: React.PropsWithChildren<unknown>) {
  return (
    <Box margin={['0px', '0px', '60px 200px 100px 100px']}>
      <Flex flexDirection={'row'}>
        <Container>
          <Flex flexDirection={'column'}>
            <Text fontSize={'20px'}>
              <b>Maximize yield by staking MORE for xMORE</b>
            </Text>
            <br />
            <Text>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam
              exercitationem quas amet adipisci earum nesciunt repellendus ullam
              aliquam veritatis laboriosam dolorem, tempore rerum, quia iusto
              vitae aperiam consectetur! Expedita, laboriosam.
            </Text>
          </Flex>
        </Container>
        <Container>
          <Flex width={'full'} justifyContent="center">
            <img
              src="https://raw.githubusercontent.com/MoreMoney-Finance/logos/main/Coin-Logo-FINAL.jpg"
              alt="MoreMoney Logo"
              width="100px"
              height="100px"
              style={{ borderRadius: '100%' }}
            />
          </Flex>
        </Container>
      </Flex>
      <Grid
        templateColumns={['repeat(1, 1fr)', 'repeat(5, 1fr)', '520px auto']}
        templateRows={['repeat(2, 1fr)', 'repeat(2, 1fr)', '140px auto']}
        w={'full'}
        gap={'20px'}
        marginTop={'30px'}
      >
        <StakingAPR />
        <MoreBalance />
        <EditMore />
      </Grid>
      {props.children}
    </Box>
  );
}
