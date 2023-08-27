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
};

export const PositionContext = React.createContext<
  Props & ReturnType<typeof useDepositBorrowHook>
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

  const collateralInputString = collateralInput
    ? parseFloatCurrencyValue(collateralInput).toString()
    : '0';
  const borrowInputString = borrowInput
    ? parseFloatCurrencyValue(borrowInput).toString()
    : '0';

  //
  // DEPOSIT AND BORROW
  //
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

  const dangerousPosition = depositAndBorrowHook.dangerousPosition;
  const totalPercentage = depositAndBorrowHook.totalPercentage;

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
        ...depositAndBorrowHook,
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
