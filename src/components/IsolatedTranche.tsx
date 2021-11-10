import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from '@chakra-ui/accordion';
import { Avatar, AvatarGroup } from '@chakra-ui/avatar';
import { Button, Grid, GridItem, HStack, Text } from '@chakra-ui/react';
import React from 'react';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
  TxStatus,
} from '../chain-interaction/contracts';
import { addressIcons } from '../chain-interaction/tokens';
import { useWalletBalance } from './WalletBalancesContext';
import { useApproveTrans } from '../chain-interaction/transactions';
import { CurrencyValue, useEthers, useTokenAllowance } from '@usedapp/core';
import { BigNumber } from 'ethers';
import { IsolatedTrancheTable } from './IsolatedTrancheTable';
import DepositBorrowForm from './DepositBorrowForm';
import RepayWithdrawForm from './RepayWithdrawForm';

export function IsolatedTranche(
  params: React.PropsWithChildren<
    ParsedStratMetaRow | (ParsedStratMetaRow & ParsedPositionMetaRow)
  >
) {
  const { token, APY, strategyName, strategyAddress, debtCeiling } = params;

  const trancheId = 'trancheId' in params ? params.trancheId : null;

  const { account } = useEthers();

  const allowance = new CurrencyValue(
    token,
    useTokenAllowance(token.address, account, strategyAddress) ??
      BigNumber.from('0')
  );

  console.log(`allowance for ${token.name}: ${allowance.format()}`);
  console.log(`debt ceiling for ${token.name}: ${debtCeiling.format()}`);

  const walletBalance =
    useWalletBalance(token.address) ??
    new CurrencyValue(token, BigNumber.from('0'));
  console.log(`wallet balance for ${token.name}: ${walletBalance.format()}`);

  const { approveState, sendApprove } = useApproveTrans(token.address);

  const collateralBalance =
    'collateral' in params && params.collateral
      ? parseFloat(params.collateral.format())
      : 0;
  const debtBalance = 'debt' in params ? parseFloat(params.debt.format()) : 0;

  return (
    <AccordionItem>
      <h4>
        <AccordionButton>
          <HStack spacing="0.5rem">
            <AvatarGroup size="xs" max={2}>
              {(addressIcons.get(token.address) ?? []).map((iconUrl, i) => (
                <Avatar src={iconUrl} key={i + 1} />
              ))}
            </AvatarGroup>
            <Text>{token.name}</Text>
            <Text>{strategyName}</Text>
            <Text>{APY.toPrecision(4)} % APY</Text>
            <Text>
              {collateralBalance.toPrecision(4)} {token.ticker}
            </Text>
            <Text> {debtBalance.toPrecision(4)} debt </Text>
            <AccordionIcon />
          </HStack>
        </AccordionButton>
      </h4>

      <AccordionPanel>
        {allowance.gt(walletBalance) === false ? (
          <Button
            onClick={() => sendApprove(strategyAddress)}
            isLoading={
              approveState.status == TxStatus.SUCCESS &&
              allowance.gt(walletBalance) === false
            }
          >
            Approve {token.name}{' '}
          </Button>
        ) : (
          <Grid templateColumns="repeat(3, 1fr)" gap={6}>
            <GridItem colSpan={1}>
              <IsolatedTrancheTable rows={[params]} />
            </GridItem>
            <GridItem colSpan={1}>
              <DepositBorrowForm trancheId={trancheId} {...params} />
            </GridItem>
            <GridItem colSpan={1}>
              <RepayWithdrawForm
                collateralBalance={collateralBalance}
                debtBalance={debtBalance}
                trancheId={trancheId}
                {...params}
              />
            </GridItem>
          </Grid>
        )}
      </AccordionPanel>
    </AccordionItem>
  );
}
