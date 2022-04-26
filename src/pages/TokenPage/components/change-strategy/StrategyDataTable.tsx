import * as React from 'react';
import { ParsedStratMetaRow } from '../../../../chain-interaction/views/contracts';
import { Table, Tbody, Tr, Th, Td } from '@chakra-ui/react';
// import {
//   useAMMHarvest,
//   useHarvestPartially,
//   useTallyHarvestBalance,
//   // useTallyHarvestBalance,
// } from '../../../../chain-interaction/transactions';
import { getExplorerAddressLink } from '@usedapp/core';
// import { EnsureWalletConnected } from '../../../../components/account/EnsureWalletConnected';
import { useLocation } from 'react-router-dom';
// import { TransactionErrorDialog } from '../../../../components/notifications/TransactionErrorDialog';

export function StrategyDataTable(row: ParsedStratMetaRow) {
  const location = useLocation();
  const details = location.search?.toString().includes('details=true');

  // const { sendTallyHarvestBalance } = useTallyHarvestBalance(
  //   row.strategyAddress
  // );
  // const { sendAMMHarvest, AMMHarvestState } = useAMMHarvest(
  //   row.strategyAddress
  // );

  // const { sendHarvestPartially, harvestPartiallyState } = useHarvestPartially(
  //   row.strategyAddress
  // );

  const balance2Tally = row.harvestBalance2Tally;

  const explorerLink = getExplorerAddressLink(
    row.strategyAddress,
    row.token.chainId
  );

  // console.log('details', details);

  return (
    <>
      {/* <TransactionErrorDialog
        state={harvestPartiallyState}
        title={'Harvest Partially'}
      />
      <TransactionErrorDialog state={AMMHarvestState} title={'AMM Harvest'} /> */}

      <Table variant="simple" width="auto">
        <Tbody>
          <Tr>
            <Th>Strategy</Th>
            <Td>
              <a
                href={explorerLink}
                target={'_blank'}
                rel="noreferrer"
                style={{ textDecoration: 'underline' }}
              >
                {row.strategyName.toString()}
              </a>
            </Td>
          </Tr>
          {row.stabilityFeePercent > 0 && details ? (
            <Tr>
              <Th>Stability Fee</Th>
              <Td>{row.stabilityFeePercent.toString()} %</Td>
            </Tr>
          ) : undefined}
          <Tr>
            <Th>APY</Th>
            <Td>{row.APY.toString()} %</Td>
          </Tr>
          {details ? (
            <>
              <Tr>
                <Th>Total Collateral</Th>
                <Td>{row.totalCollateral.format()}</Td>
              </Tr>
              <Tr>
                <Th>Minimum colateralization ratio</Th>
                <Td>
                  {((1 / (row.borrowablePercent / 100)) * 100).toFixed(2)} %
                </Td>
              </Tr>
              <Tr>
                <Th>Loan to value ratio</Th>
                <Td>{row.borrowablePercent.toString()} %</Td>
              </Tr>
              <Tr>
                <Th>Harvest Balance To tally</Th>
                {/* <Td>
                  {balance2Tally.isZero() ? (
                    balance2Tally.format()
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => sendTallyHarvestBalance(row.token.address)}
                    >
                      {' '}
                      Tally {balance2Tally.format}{' '}
                    </Button>
                  )}
                </Td> */}
              </Tr>
            </>
          ) : undefined}
          <Tr>
            <Th>Harvest</Th>
            <Td>
              {/* <EnsureWalletConnected>
                <Button
                  size="sm"
                  onClick={() => {
                    if (row.yieldType === YieldType.REPAYING) {
                      sendAMMHarvest(row.token.address);
                    } else if (row.yieldType === YieldType.COMPOUNDING) {
                      sendHarvestPartially(row.token.address);
                    }
                  }}
                >
                  Harvest
                </Button>
              </EnsureWalletConnected> */}
            </Td>
          </Tr>
          {details ? (
            <Tr>
              <Th>TVL in Token</Th>
              <Td>{row.tvlInToken.format()}</Td>
            </Tr>
          ) : undefined}
          <Tr>
            <Th>TVL</Th>
            <Td>{row.tvlInPeg.format()}</Td>
          </Tr>
          <Tr>
            <Th>Yield Type</Th>
            <Td>{row.yieldType.toString()}</Td>
          </Tr>
        </Tbody>
      </Table>
    </>
  );
}
