import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Grid,
  GridItem,
  Table,
  Td,
  Text,
  Thead,
  Tr,
  Link
} from '@chakra-ui/react';
import { useEthers } from '@usedapp/core';
import * as React from 'react';
import {
  ParsedStakingMetadata,
  useAddresses,
  useParsedStakingMetadata,
} from '../../chain-interaction/contracts';
import ClaimReward from '../../components/FarmPageComponents/ClaimReward';
import DepositForm from '../../components/FarmPageComponents/DepositForm';
import WithdrawForm from '../../components/FarmPageComponents/WithdrawForm';
import { TokenDescription } from '../../components/TokenDescription';
import farminfo from '../../contracts/farminfo.json';

export function FarmPage(params: React.PropsWithChildren<unknown>) {
  const { account, chainId } = useEthers();

  const stakeMeta: ParsedStakingMetadata[] = useParsedStakingMetadata(
    [useAddresses().CurvePoolRewards],
    account ?? ''
  ).flat(1);

  const farmInfoIdx = (chainId?.toString() ?? '43114') as keyof typeof farminfo;
  const getLPTokenLinks = [`https://avax.curve.fi/factory/${farminfo[farmInfoIdx].curvePoolIdx}/deposit`];

  return (
    <>
      <Box padding={'12'} width={'full'}>
        <Box textAlign="center" margin="100px 0">
          <Text fontSize="48" lineHeight="56px">
            Yield Farming is easy, stake your
          </Text>
          <Text fontSize="48" lineHeight="56px">
            token, sit back and relax!
          </Text>
        </Box>
        <Table width="full">
          <Thead>
            <Tr>
              <Td textAlign={'center'}>Asset</Td>
              <Td textAlign={'center'}>Stake</Td>
              <Td textAlign={'center'}>TVL</Td>
              <Td textAlign={'center'}>Reward</Td>
              <Td textAlign={'center'}>APR</Td>
              <Td textAlign={'center'}>Acquire</Td>
            </Tr>
          </Thead>
        </Table>
        <Accordion allowToggle allowMultiple width={'full'} variant={'farm'} defaultIndex={0}>
          {stakeMeta.map((item, index) => {
            return (
              <div key={'item' + index}>
                <AccordionItem
                  width={'full'}
                  style={{
                    content: '""',
                    borderRadius: '10px',
                    marginTop: '10px',
                    boxSizing: 'border-box',
                    border: '1px solid transparent',
                    backgroundClip: 'padding-box, border-box',
                    backgroundOrigin: 'padding-box, border-box',
                    backgroundImage:
                      'linear-gradient(hsla(227, 12%, 15%, 1), hsla(227, 12%, 15%, 1)), linear-gradient(to right, hsla(0, 100%, 64%, 0.3) 0%, hsla(193, 100%, 50%, 0.3) 100%)',
                    zIndex: 'var(--chakra-zIndices-hide)',
                    fontSize: '18px',
                    lineHeight: '27px',
                    padding: '16px 30px',
                  }}
                >
                  <AccordionButton width={'full'}>
                    <Grid
                      templateColumns="repeat(6, 1fr)"
                      gap={2}
                      w={'full'}
                      alignContent={'center'}
                      verticalAlign={'center'}
                    >
                      <Box w="120%">
                        <TokenDescription token={item.stakingToken} />
                      </Box>
                      <Box w="90%">
                        <Text>{item.stakedBalance.format({ suffix: '' })}</Text>
                      </Box>
                      <Box w="100%">
                        <Text>$ {item.tvl.format({ suffix: '' })}</Text>
                      </Box>
                      <Box w="120%">
                        <TokenDescription token={item.rewardsToken} />
                      </Box>
                      <Box w="100%">{item.aprPercent} %</Box>
                      <Box w="100%">
                        <Button as={Link} href={getLPTokenLinks[index]} isExternal>
                          Get LP Token &nbsp;
                          <ExternalLinkIcon />
                        </Button>
                      </Box>
                    </Grid>
                  </AccordionButton>
                  <AccordionPanel mt="16px">
                    <Grid templateColumns="repeat(13, 1fr)" gap={6}>
                      <GridItem w="100%" colSpan={5}>
                        <DepositForm stakeMeta={item} />
                      </GridItem>
                      <GridItem w="100%" colSpan={5}>
                        <WithdrawForm stakeMeta={item} />
                      </GridItem>
                      <GridItem colSpan={3} w="110%">
                        <ClaimReward
                          stakeMeta={item}
                          token={item.rewardsToken}
                        />
                      </GridItem>
                    </Grid>
                  </AccordionPanel>
                </AccordionItem>
              </div>
            );
          })}
        </Accordion>
        {params.children}
      </Box>
    </>
  );
}
