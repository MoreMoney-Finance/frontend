import { Text, useDisclosure } from '@chakra-ui/react';
import { CurrencyValue } from '@usedapp/core';
import React from 'react';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
  useStable,
} from '../chain-interaction/contracts';
import { TokenDescription } from '../components/tokens/TokenDescription';
import { useDepositBorrowHook } from '../hooks/useDepositBorrow';
import { useRepayWithdrawHook } from '../hooks/useRepayWithdraw';
import { ConfirmPositionModal } from '../pages/TokenPage/components/edit/ConfirmPositionModal';
import { parseFloatCurrencyValue } from '../utils';

type Props = {
  lockDepositBorrow: boolean;
  setLockDepositBorrow: React.Dispatch<React.SetStateAction<boolean>>;
  lockRepayWithdraw: boolean;
  setLockRepayWithdraw: React.Dispatch<React.SetStateAction<boolean>>;
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
  depositAndBorrowClicked: (data: { [x: string]: any }) => void;
  repayAndWithdrawClicked: (data: { [x: string]: any }) => void;
};

export const PositionContext = React.createContext<
  Props & {
    depositAndBorrowFunctions: ReturnType<typeof useDepositBorrowHook>;
  } & { repayAndWithdrawFunctions: ReturnType<typeof useRepayWithdrawHook> }
>({} as any);

export function PositionCtxProvider({
  children,
  stratMeta,
  position,
}: React.PropsWithChildren<{
  children: React.ReactNode;
  position?: ParsedPositionMetaRow;
  stratMeta: ParsedStratMetaRow;
}>) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalAction, setModalAction] = React.useState<any>();
  const [modalTitle, setModalTitle] = React.useState('');
  const [modalBody, setModalBody] = React.useState<any>([]);
  const stable = useStable();
  const { token } = stratMeta;

  const [lockDepositBorrow, setLockDepositBorrow] =
    React.useState<boolean>(false);
  const [lockRepayWithdraw, setLockRepayWithdraw] =
    React.useState<boolean>(false);

  const [collateralInput, setCollateralInput] = React.useState<CurrencyValue>();
  const [borrowInput, setBorrowInput] = React.useState<CurrencyValue>();
  const [collateralWithdraw, setCollateralWithdraw] =
    React.useState<CurrencyValue>();
  const [repayInput, setRepayInput] = React.useState<CurrencyValue>();

  //
  // REPAY AND WITHDRAW
  //
  const repayInputString = repayInput
    ? parseFloatCurrencyValue(repayInput).toString()
    : '0';
  const collateralWithdrawString = collateralWithdraw
    ? parseFloatCurrencyValue(collateralWithdraw).toString()
    : '0';

  const repayWithdrawHook = useRepayWithdrawHook({
    position,
    repayInput: repayInputString,
    stratMeta,
    withdrawInput: collateralWithdrawString,
  });

  function repayAndWithdrawClicked(data: { [x: string]: any }) {
    const modalBody = [
      {
        title: <TokenDescription token={stable} />,
        value: <Text>{repayInputString}</Text>,
      },
      {
        title: <TokenDescription token={token} />,
        value: <Text>{collateralWithdrawString}</Text>,
      },
    ];
    if (lockRepayWithdraw) {
      setModalAction(() => repayWithdrawHook.repayWithdraw);
      setModalTitle('Confirm Repay / Withdraw');
      setModalBody(modalBody);
    } else if (lockRepayWithdraw === false) {
      if (data['collateral-withdraw']) {
        setModalAction(() => repayWithdrawHook.withdraw);
        setModalTitle('Confirm Withdraw');
        setModalBody([modalBody[1]]);
      } else {
        setModalAction(() => repayWithdrawHook.repay);
        setModalTitle('Confirm Repay');
        setModalBody([modalBody[0]]);
      }
    }
    onOpen();
  }

  //
  // DEPOSIT AND BORROW
  //
  const collateralInputString = collateralInput
    ? parseFloatCurrencyValue(collateralInput).toString()
    : '0';
  const borrowInputString = borrowInput
    ? parseFloatCurrencyValue(borrowInput).toString()
    : '0';
  const depositAndBorrowHook = useDepositBorrowHook({
    position,
    collateralInput: collateralInputString,
    stratMeta,
    borrowInput: borrowInputString,
  });

  function depositAndBorrowClicked(data: { [x: string]: any }) {
    const modalBody = [
      {
        title: <TokenDescription token={token} />,
        value: <Text>{collateralInputString}</Text>,
      },
      {
        title: <TokenDescription token={stable} />,
        value: <Text>{borrowInputString}</Text>,
      },
    ];
    if (lockDepositBorrow) {
      if (collateralInputString !== '0' && borrowInputString !== '0') {
        setModalAction(() => depositAndBorrowHook.depositAndBorrow);
        setModalTitle('Confirm Deposit and Borrow');
        setModalBody(modalBody);
      }
    } else if (lockDepositBorrow === false) {
      if (data['collateral-deposit']) {
        setModalAction(() => depositAndBorrowHook.deposit);
        setModalTitle('Confirm Deposit');
        setModalBody([modalBody[0]]);
      } else {
        setModalAction(() => depositAndBorrowHook.borrow);
        setModalTitle('Confirm Borrow');
        setModalBody([modalBody[1]]);
      }
    }
    onOpen();
  }

  const dangerousPosition = lockDepositBorrow
    ? depositAndBorrowHook.dangerousPosition
    : repayWithdrawHook.dangerousPosition;
  const totalPercentage = lockDepositBorrow
    ? depositAndBorrowHook.totalPercentage
    : repayWithdrawHook.totalPercentage;

  return (
    <PositionContext.Provider
      value={{
        lockDepositBorrow,
        setLockDepositBorrow,
        lockRepayWithdraw,
        setLockRepayWithdraw,
        collateralInput,
        setCollateralInput,
        borrowInput,
        setBorrowInput,
        collateralWithdraw,
        setCollateralWithdraw,
        repayInput,
        setRepayInput,
        depositAndBorrowClicked,
        repayAndWithdrawClicked,
        depositAndBorrowFunctions: { ...depositAndBorrowHook },
        repayAndWithdrawFunctions: { ...repayWithdrawHook },
      }}
    >
      <ConfirmPositionModal
        title={modalTitle}
        isOpen={isOpen}
        onClose={onClose}
        confirm={() => {
          console.log('modalAction', modalAction);
          modalAction();
        }}
        body={[
          ...modalBody,
          {
            title: <Text>At Loan-To-Value %</Text>,
            value: <Text>{totalPercentage.toFixed(1)}%</Text>,
          },
        ]}
        dangerous={dangerousPosition}
      />
      {children}
    </PositionContext.Provider>
  );
}
