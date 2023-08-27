import {
  CurrencyValue,
  useEtherBalance,
  useEthers,
  useTokenAllowance,
} from '@usedapp/core';
import { BigNumber } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import React, { useEffect } from 'react';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
} from '../chain-interaction/contracts';
import {
  useApproveTrans,
  useDepositBorrowTrans,
  useNativeDepositBorrowTrans,
} from '../chain-interaction/transactions';
import { WNATIVE_ADDRESS } from '../constants/addresses';
import { MakeMostOfMoneyContext } from '../contexts/MakeMostOfMoneyContext';
import { UserAddressContext } from '../contexts/UserAddressContext';
import { useWalletBalance } from '../contexts/WalletBalancesContext';
import { parseFloatCurrencyValue, parseFloatNoNaN } from '../utils';

export const useDepositBorrowHook = ({
  position,
  collateralInput,
  stratMeta,
  borrowInput,
  customPercentageInput,
}: {
  stratMeta: ParsedStratMetaRow;
  position?: ParsedPositionMetaRow;
  collateralInput: string;
  borrowInput: string;
  customPercentageInput?: string;
}) => {
  const { token, strategyAddress, borrowablePercent, usdPrice } = stratMeta;
  const { chainId } = useEthers();
  const account = React.useContext(UserAddressContext);
  const allowTokenExtrawurst =
    getAddress(token.address) === '0x9e295B5B976a184B14aD8cd72413aD846C299660'
      ? '0x5643F4b25E36478eE1E90418d5343cb6591BcB9d'
      : token.address;
  const allowResult = useTokenAllowance(
    allowTokenExtrawurst,
    account,
    strategyAddress
  );
  const allowCV = new CurrencyValue(token, allowResult ?? BigNumber.from('0'));
  const allowance = token.address && account && strategyAddress && allowCV;

  const etherBalance = useEtherBalance(account);

  const nativeTokenBalance = etherBalance
    ? new CurrencyValue(token, etherBalance)
    : new CurrencyValue(token, BigNumber.from('0'));

  const walletBalance =
    useWalletBalance(token.address) ??
    new CurrencyValue(token, BigNumber.from('0'));

  const { approveState, sendApprove } = useApproveTrans(token.address);

  const { sendDepositBorrow, depositBorrowState } = useDepositBorrowTrans(
    position?.trancheId
  );

  const { onToggle, onClose: onClosePopover } = React.useContext(
    MakeMostOfMoneyContext
  );
  const {
    sendDepositBorrow: sendNativeDepositBorrow,
    depositBorrowState: nativeDepositBorrowState,
  } = useNativeDepositBorrowTrans(position?.trancheId);

  const isNativeToken = WNATIVE_ADDRESS[chainId!] === token.address;

  function deposit() {
    console.log('deposit', collateralInput, borrowInput);
    if (isNativeToken) {
      sendNativeDepositBorrow(token, strategyAddress, collateralInput, '0');
    } else {
      sendDepositBorrow(token, strategyAddress, collateralInput, '0');
    }
  }

  function borrow() {
    if (isNativeToken) {
      sendNativeDepositBorrow(token, strategyAddress, '0', borrowInput);
    } else {
      sendDepositBorrow(token, strategyAddress, '0', borrowInput);
    }
  }

  function depositAndBorrow() {
    if (isNativeToken) {
      sendNativeDepositBorrow(
        token,
        strategyAddress,
        collateralInput,
        borrowInput
      );
    } else {
      sendDepositBorrow(token, strategyAddress, collateralInput, borrowInput);
    }
  }

  useEffect(() => {
    async function waitTransactionResult() {
      const depositBorrowResult = await depositBorrowState.transaction?.wait();
      const nativeDepositBorrowResult =
        await nativeDepositBorrowState.transaction?.wait();
      if (
        depositBorrowResult?.status === 1 ||
        nativeDepositBorrowResult?.status === 1
      ) {
        onToggle();
        setTimeout(() => {
          onClosePopover();
        }, 60000);
      }
    }
    waitTransactionResult();
  }, [depositBorrowState, nativeDepositBorrowState]);
  const inputExceedsAllowance =
    allowCV &&
    parseFloatNoNaN(collateralInput) > parseFloatCurrencyValue(allowCV);

  const extantCollateral =
    position && position.collateral
      ? parseFloatCurrencyValue(position.collateral)
      : 0;
  const totalCollateral = parseFloatNoNaN(collateralInput) + extantCollateral;

  const extantDebt =
    position && position.debt && position.debt.gt(position.yield)
      ? parseFloatCurrencyValue(position.debt.sub(position.yield))
      : 0;
  const totalDebt = parseFloatNoNaN(borrowInput) + extantDebt;

  const currentPercentage =
    totalCollateral > 0 && usdPrice > 0
      ? (100 * extantDebt) / (totalCollateral * usdPrice)
      : 0;
  const percentageRange = borrowablePercent - currentPercentage;

  const percentageStep = Math.max(percentageRange / 5, 10);
  const percentageSteps =
    10 >= percentageRange
      ? [(currentPercentage + borrowablePercent) / 2]
      : Array(Math.floor((percentageRange - 0.5) / percentageStep))
        .fill(currentPercentage)
        .map((p, i) => Math.round((p + (i + 1) * percentageStep) / 5) * 5);

  const totalPercentage =
    totalCollateral > 0 && usdPrice > 0
      ? (100 * totalDebt) / (totalCollateral * usdPrice)
      : 0;

  const percentageLabel =
    totalCollateral > 0 && usdPrice > 0
      ? `${totalPercentage.toFixed(0)} %`
      : 'LTV %';
  const percentages = Object.fromEntries(
    percentageSteps.map((percentage) => [
      `${percentage.toFixed(0)} %`,
      (percentage * totalCollateral * usdPrice) / 100 - extantDebt,
    ])
  );

  const showWarning =
    !(
      parseFloatNoNaN(collateralInput) === 0 &&
      parseFloatNoNaN(borrowInput) === 0
    ) && totalPercentage > borrowablePercent;

  const depositBorrowDisabled =
    !position &&
    (isNativeToken ? nativeTokenBalance.isZero() : walletBalance.isZero());

  // const isJoeToken =
  //   getAddress(token.address) ===
  //   getAddress('0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd');

  // const depositBorrowButtonDisabledForJoe =
  //   parseFloatNoNaN(collateralInput) > 0 && isJoeToken;

  const depositBorrowButtonDisabled =
    (parseFloatNoNaN(collateralInput) === 0 &&
      parseFloatNoNaN(borrowInput) === 0) ||
    totalPercentage > borrowablePercent;

  const liquidatableZone = borrowablePercent;
  const criticalZone = (90 * borrowablePercent) / 100;
  const riskyZone = (80 * borrowablePercent) / 100;
  const healthyZone = (50 * borrowablePercent) / 100;

  const positionHealthColor =
    0.1 > totalDebt
      ? 'accent'
      : totalPercentage > liquidatableZone
        ? 'purple.400'
        : totalPercentage > criticalZone
          ? 'red'
          : totalPercentage > riskyZone
            ? 'orange'
            : totalPercentage > healthyZone
              ? 'green'
              : 'accent';
  const positionHealth = {
    accent: 'Safe',
    green: 'Healthy',
    orange: 'Risky',
    red: 'Critical',
    ['purple.400']: 'Liquidatable',
  };

  // console.log(
  //   'DepositBorrow',
  //   position?.debt,
  //   borrowablePercent,
  //   totalPercentage,
  //   currentPercentage
  // );

  const dangerousPosition = totalPercentage > borrowablePercent * 0.92;
  console.log('customPercentageInput', customPercentageInput);

  const balance = isNativeToken ? nativeTokenBalance : walletBalance;
  const collateralInputUsd = parseFloatNoNaN(collateralInput) * usdPrice;

  return {
    deposit,
    borrow,
    allowance,
    approveState,
    sendApprove,
    inputExceedsAllowance,
    percentageLabel,
    percentages,
    showWarning,
    depositBorrowDisabled,
    depositBorrowButtonDisabled,
    balance,
    dangerousPosition,
    positionHealth,
    positionHealthColor,
    collateralInputUsd,
    depositAndBorrow,
    isNativeToken,
    token,
    totalCollateral,
    usdPrice,
    extantDebt,
    totalPercentage,
    depositBorrowState,
    nativeDepositBorrowState,
    strategyAddress,
  };
};
