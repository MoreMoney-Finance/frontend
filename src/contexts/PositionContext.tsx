import { CurrencyValue } from '@usedapp/core';
import React from 'react';

export const PositionContext = React.createContext<{
  collateralInput?: CurrencyValue;
  setCollateralInput?: React.Dispatch<
    React.SetStateAction<CurrencyValue | undefined>
  >;
  borrowInput?: CurrencyValue;
  setBorrowInput?: React.Dispatch<
    React.SetStateAction<CurrencyValue | undefined>
  >;
  collateralWithdraw?: CurrencyValue;
  setCollateralWithdraw?: React.Dispatch<
    React.SetStateAction<CurrencyValue | undefined>
  >;
  repayInput?: CurrencyValue;
  setRepayInput?: React.Dispatch<
    React.SetStateAction<CurrencyValue | undefined>
  >;
}>({
  collateralInput: undefined,
  setCollateralInput: undefined,
  borrowInput: undefined,
  setBorrowInput: undefined,
  collateralWithdraw: undefined,
  setCollateralWithdraw: undefined,
  repayInput: undefined,
  setRepayInput: undefined,
});

export function PositionCtxProvider({
  children,
}: React.PropsWithChildren<{
  children: React.ReactNode;
}>) {
  const [collateralInput, setCollateralInput] = React.useState<CurrencyValue>();
  const [borrowInput, setBorrowInput] = React.useState<CurrencyValue>();
  const [collateralWithdraw, setCollateralWithdraw] =
    React.useState<CurrencyValue>();
  const [repayInput, setRepayInput] = React.useState<CurrencyValue>();

  return (
    <PositionContext.Provider
      value={{
        collateralInput,
        setCollateralInput,
        borrowInput,
        setBorrowInput,
        collateralWithdraw,
        setCollateralWithdraw,
        repayInput,
        setRepayInput,
      }}
    >
      {children}
    </PositionContext.Provider>
  );
}
