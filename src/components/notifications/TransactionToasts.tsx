import * as React from 'react';
import {
  ChainId,
  getExplorerTransactionLink,
  useEthers,
  useNotifications,
} from '@usedapp/core';
import { Slide, toast } from 'react-toastify';

export const TransactionToasts: React.FC = () => {
  const { notifications } = useNotifications();
  const { chainId } = useEthers();
  const _chainId = chainId === ChainId.Hardhat ? ChainId.Avalanche : chainId;

  function showToast(title: string, status: string, notification: any) {
    const hash = notification.transaction.hash;
    const explorerLink = getExplorerTransactionLink(hash, _chainId!);
    console.log('explorerLink', explorerLink);
    const toastClassName = `toastify-${status}`;
    toast.success('Código copiado com sucesso', {
      position: 'bottom-right',
      className: toastClassName,

      autoClose: 1500,
      closeButton: false,
      icon: true,
      hideProgressBar: true,
      closeOnClick: true,
      transition: Slide,
      theme: 'colored',
      toastId: notification.id,
    });
    // toast({
    //   title: title,
    //   description: (
    //     <a
    //       href={explorerLink}
    //       target="_blank"
    //       rel="noreferrer"
    //       style={{ textDecoration: 'underline' }}
    //     >
    //       {`${hash.slice(0, 6)}...${hash.slice(hash.length - 4, hash.length)}`}
    //     </a>
    //   ),
    //   status: status,
    //   duration: 7000,
    //   isClosable: true,
    //   position: 'bottom-right',
    // });
  }

  React.useEffect(() => {
    notifications.map((notification: any) => {
      switch (notification.type) {
        case 'transactionStarted':
          showToast('Transaction Started', 'info', notification);
          break;
        case 'transactionSucceed':
          showToast('Transaction Succeeded', 'success', notification);
          break;
        case 'transactionFailed':
          showToast('Transaction Failed', 'error', notification);
          break;
        default:
          break;
      }
    });
  }, [notifications]);

  return <></>;
};
