import React, { useContext } from 'react';
import { Button, FormControl } from '@chakra-ui/react';
import { CurrencyValue, Token, useTokenBalance } from '@usedapp/core';
import { useForm } from 'react-hook-form';
import { useConvertReward2Stable } from '../chain-interaction/transactions';
import { TokenAmountInputField } from './TokenAmountInputField';
import { formatEther, parseEther, parseUnits } from '@ethersproject/units';
import { WalletBalancesContext } from '../contexts/WalletBalancesContext';
import { BigNumber } from '@usedapp/core/node_modules/ethers';
import { useStable } from '../chain-interaction/contracts';
import { useOraclePrices } from '../chain-interaction/tokens';

export function ConvertReward({
  strategyAddress,
  rewardToken,
}: {
  strategyAddress: string;
  rewardToken: Token;
}) {
  const {
    handleSubmit,
    watch,
    register,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  const priceResult = useOraclePrices([rewardToken]);
  const usdPrice =
    rewardToken.address in priceResult
      ? priceResult[rewardToken.address]
      : undefined;

  const stable = useStable();
  const stableBalance =
    useContext(WalletBalancesContext).get(stable.address) ||
    new CurrencyValue(stable, BigNumber.from('0'));
  const strategyConvertibleBalance = useTokenBalance(
    rewardToken.address,
    strategyAddress
  );
  const maxConversion = usdPrice
    ? parseFloat(
      formatEther(
        usdPrice
          .mul(strategyConvertibleBalance)
          .div(parseUnits('1', rewardToken.decimals))
      )
    )
    : 0;
  const { sendConvertReward2Stable } = useConvertReward2Stable(strategyAddress);

  const conversionAmountState = watch('conversion-amount', 0);
  const rewardTokenConverted = usdPrice
    ? parseEther(conversionAmountState.toString() || '0').mul(
      parseUnits('1', rewardToken.decimals).div(usdPrice.value)
    )
    : BigNumber.from('0');

  function onConvert(data: { [x: string]: any }) {
    console.log('onConvert');
    console.log(data);
    const targetBid = parseEther(conversionAmountState.toString());
    if (rewardTokenConverted.isZero()) {
      console.error(
        'Trying to convert to zero amount -- perhaps coingecko isnt returning price'
      );
    } else {
      sendConvertReward2Stable(rewardTokenConverted, targetBid);
    }
  }

  const rewardTokenValue = new CurrencyValue(rewardToken, rewardTokenConverted);
  return (
    <form onSubmit={handleSubmit(onConvert)}>
      <FormControl isInvalid={errors.name}>
        {/* <FormLabel>Convert stable to {rewardToken.name}</FormLabel> */}
        <TokenAmountInputField
          name="conversion-amount"
          min={0.0001}
          max={Math.min(
            maxConversion,
            parseFloat(stableBalance.format({ significantDigits: 30 }))
          )}
          showMaxButton={true}
          placeholder={`${rewardToken.name} amount`}
          registerForm={register}
          setValueForm={setValue}
        />

        <Button type="submit" isLoading={isSubmitting}>
          {`Convert to ${
            rewardTokenValue.isZero()
              ? rewardToken.name
              : rewardTokenValue.format()
          }`}
        </Button>
      </FormControl>
    </form>
  );
}
