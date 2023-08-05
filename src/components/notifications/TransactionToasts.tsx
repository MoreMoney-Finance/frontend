import { ChainId, useEthers, useNotifications } from '@usedapp/core';
import * as React from 'react';
import { showToast } from './Toasts';

export const TransactionToasts: React.FC = () => {
  const { notifications } = useNotifications();
  const { chainId } = useEthers();
  const _chainId = chainId === ChainId.Hardhat ? ChainId.Avalanche : chainId;

  React.useEffect(() => {
    notifications.map((notification: any) => {
      switch (notification.type) {
      case 'transactionStarted':
        showToast('info', notification?.transaction?.hash, _chainId!);
        break;
      case 'transactionSucceed':
        showToast('success', notification?.transaction?.hash, _chainId!);
        break;
      case 'transactionFailed':
        showToast('error', notification?.transaction?.hash, _chainId!);
        break;
      default:
        break;
      }
    });
  }, [notifications]);

  return <></>;
};
