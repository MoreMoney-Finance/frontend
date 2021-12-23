import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Grid,
  Table,
  Td,
  Text,
  Thead,
  Tr,
} from '@chakra-ui/react';
import * as React from 'react';
import { ParsedStratMetaRow } from '../../chain-interaction/contracts';
import ClaimReward from '../../components/FarmPageComponents/ClaimReward';
import DepositForm from '../../components/FarmPageComponents/DepositForm';
import WithdrawForm from '../../components/FarmPageComponents/WithdrawForm';
import { TokenDescription } from '../../components/TokenDescription';
import { LiquidationFeesContext } from '../../contexts/LiquidationFeesContext';
import { StrategyMetadataContext } from '../../contexts/StrategyMetadataContext';

export function FarmPage(params: React.PropsWithChildren<unknown>) {
  const stratMeta: ParsedStratMetaRow[] = Object.values(
    React.useContext(StrategyMetadataContext)
  ).map((x) =>
    Object.values(x).reduce((aggStrat, nextStrat) => ({
      ...aggStrat,
      APY: aggStrat.APY > nextStrat.APY ? aggStrat.APY : nextStrat.APY,
      debtCeiling: aggStrat.debtCeiling.add(nextStrat.debtCeiling),
      totalDebt: aggStrat.totalDebt.add(nextStrat.totalDebt),
    }))
  );

  const tokenFees = React.useContext(LiquidationFeesContext);

  const data = stratMeta.map((meta) => {
    return {
      ...meta,
      asset: <TokenDescription token={meta.token} />,
      apy: meta.APY.toFixed(4) + '%',
      MONEYavailable: meta.debtCeiling.sub(meta.totalDebt).format(),
      minColRatio:
        ((1 / (meta.borrowablePercent / 100)) * 100).toFixed(2) + '%',
      totalBorrowed: meta.totalDebt.format({ significantDigits: 2 }),
      liquidationFee: tokenFees.get(meta.token.address) + '%' ?? '',
    };
  });

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
              <Td textAlign={'center'}>APY</Td>
              <Td textAlign={'center'}>Actions</Td>
            </Tr>
          </Thead>
        </Table>
        <Accordion allowToggle allowMultiple width={'full'} variant={'farm'}>
          {data.map((item) => {
            return (
              <div key={item.asset.key}>
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
                        <TokenDescription token={item.token} />
                      </Box>
                      <Box w="90%">
                        <Text>$200</Text>
                      </Box>
                      <Box w="100%">
                        <Text>$200,000.30</Text>
                      </Box>
                      <Box w="120%">
                        <TokenDescription token={item.token} />
                      </Box>
                      <Box w="100%">20%</Box>
                      <Box w="100%">
                        <Button>Stake</Button>
                      </Box>
                    </Grid>
                  </AccordionButton>
                  <AccordionPanel>
                    <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                      <Box w="100%">
                        <DepositForm stratMeta={item} />
                      </Box>
                      <Box w="100%">
                        <WithdrawForm stratMeta={item} />
                      </Box>
                      <Box w="100%">
                        <ClaimReward stratMeta={item} token={item.token} />
                      </Box>
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
