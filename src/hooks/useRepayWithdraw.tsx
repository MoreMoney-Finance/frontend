import { CurrencyValue, useEthers } from '@usedapp/core';
import { BigNumber } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
  useStable,
} from '../chain-interaction/contracts';
import {
  useNativeRepayWithdrawTrans,
  useRepayWithdrawTrans,
} from '../chain-interaction/transactions';
import { WNATIVE_ADDRESS } from '../constants/addresses';
import { useWalletBalance } from '../contexts/WalletBalancesContext';
import { parseFloatCurrencyValue, parseFloatNoNaN } from '../utils';

export const useRepayWithdrawHook = ({
  position,
  repayInput,
  stratMeta,
  withdrawInput,
}: {
  stratMeta: ParsedStratMetaRow;
  position?: ParsedPositionMetaRow;
  repayInput: string;
  withdrawInput: string;
  customPercentageInput?: string;
}) => {
  const { token, strategyAddress, borrowablePercent, usdPrice } = stratMeta;
  const { chainId } = useEthers();
  const isNativeToken = WNATIVE_ADDRESS[chainId!] === token.address;
  const stable = useStable();
  const { sendRepayWithdraw, repayWithdrawState } = useRepayWithdrawTrans(
    position && position.trancheId,
    token,
    position?.debt
  );
  // console.log('position.trancheId', position?.trancheId);
  const {
    sendRepayWithdraw: sendNativeRepayWithdraw,
    repayWithdrawState: sendNativeWithdrawState,
  } = useNativeRepayWithdrawTrans(
    position && position.trancheId,
    token,
    position?.debt
  );

  function repay() {
    if (isNativeToken) {
      sendNativeRepayWithdraw(withdrawInput, repayInput);
    } else {
      sendRepayWithdraw(withdrawInput, repayInput);
    }
  }
  function withdraw() {
    if (isNativeToken) {
      sendNativeRepayWithdraw(withdrawInput, repayInput);
    } else {
      sendRepayWithdraw(withdrawInput, repayInput);
    }
  }

  function repayWithdraw() {
    if (isNativeToken) {
      sendNativeRepayWithdraw(withdrawInput, repayInput);
    } else {
      sendRepayWithdraw(withdrawInput, repayInput);
    }
  }

  const walletBalance =
    useWalletBalance(stable.address) ??
    new CurrencyValue(stable, BigNumber.from('0'));

  const repayWithdrawDisabled =
    !position ||
    !position.collateral ||
    (position.collateral.isZero() && position.debt.isZero());

  // const [collateralInput, repayInput /*customPercentageInput*/] = watch([
  //   'collateral-withdraw',
  //   'money-repay',
  //   // 'custom-percentage',
  // ]);

  const extantCollateral =
    position && position.collateral
      ? parseFloatCurrencyValue(position.collateral)
      : 0;
  const totalCollateral = extantCollateral - parseFloatNoNaN(withdrawInput);

  const extantDebt =
    position && position.debt && position.debt.gt(position.yield)
      ? parseFloatCurrencyValue(position.debt.sub(position.yield))
      : 0;
  const totalDebt = extantDebt - parseFloatNoNaN(repayInput);

  // const currentPercentage =
  //   totalCollateral > 0 ? (100 * extantDebt) / (totalCollateral * usdPrice) : 0;

  // const percentageStep = Math.max(currentPercentage / 5, 10);
  // const percentageSteps =
  //   10 >= currentPercentage
  //     ? [currentPercentage / 2]
  //     : Array(Math.floor((currentPercentage - 0.5) / percentageStep))
  //       .fill(0)
  //       .map((p, i) => Math.round((p + (i + 1) * percentageStep) / 5) * 5);

  const totalPercentage =
    totalCollateral > 0 && usdPrice > 0
      ? (100 * totalDebt) / (totalCollateral * usdPrice)
      : 0;

  const percentageLabel =
    totalCollateral > 0 ? `${totalPercentage.toFixed(0)} %` : 'LTV %';
  // const percentages = Object.fromEntries(
  //   percentageSteps.map((percentage) => [
  //     `${percentage.toFixed(0)} %`,
  //     totalCollateral - (totalDebt * 100) / (usdPrice * customPercentageInput)
  //   ])
  // );

  // React.useEffect(() => {
  //   if (customPercentageInput) {
  //     setValueRepayForm(
  //       'collateral-withdraw',
  //       totalCollateral - (totalDebt * 100) / (usdPrice * customPercentageInput)
  //     );
  //   } else if (
  //     collateralInput &&
  //     collateralInput > 0 &&
  //     totalPercentage > borrowablePercent
  //   ) {
  //     setValueRepayForm(
  //       'money-repay',
  //       (borrowablePercent * totalCollateral * usdPrice) / 100 - extantDebt
  //     );
  //   }
  // }, [
  //   customPercentageInput,
  //   collateralInput,
  //   totalCollateral,
  //   extantDebt,
  //   usdPrice,
  // ]);

  const repayingMoreThanBalance =
    !isNaN(parseFloat(repayInput)) &&
    parseEther(repayInput || '0').gt(walletBalance.value);

  const repayWithdrawButtonDisabled =
    (parseFloatNoNaN(withdrawInput) === 0 &&
      parseFloatNoNaN(repayInput) === 0) ||
    totalPercentage > borrowablePercent ||
    (totalCollateral === 0 && totalDebt > 0) ||
    repayingMoreThanBalance;

  const showWarning =
    (!(
      parseFloatNoNaN(withdrawInput) === 0 && parseFloatNoNaN(repayInput) === 0
    ) &&
      totalPercentage > borrowablePercent) ||
    repayingMoreThanBalance ||
    (totalCollateral === 0 && totalDebt > 0);

  const residualDebt =
    position && position.debt.gt(position.yield)
      ? position.debt.sub(position.yield)
      : new CurrencyValue(stable, BigNumber.from(0));

  const dangerousPosition =
    totalPercentage > borrowablePercent * 0.92 && totalDebt > 0;
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
  return {
    token,
    totalCollateral,
    usdPrice,
    isNativeToken,
    extantDebt,
    repayWithdrawButtonDisabled,
    repayWithdrawState,
    sendNativeWithdrawState,
    strategyAddress,
    dangerousPosition,
    positionHealth,
    positionHealthColor,
    repayWithdraw,
    withdraw,
    percentageLabel,
    repayingMoreThanBalance,
    showWarning,
    totalPercentage,
    repayWithdrawDisabled,
    walletBalance,
    residualDebt,
    repay,
  };
};
