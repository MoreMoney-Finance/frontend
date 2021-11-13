import * as React from 'react';
import { AlertStatus, useToast } from '@chakra-ui/react';
import { getExplorerTransactionLink, useNotifications } from '@usedapp/core';

export const NotificationsComponent: React.FC = () => {
  const { notifications } = useNotifications();
  const toast = useToast();

  function showToast(title: string, status: AlertStatus, notification: any) {
    const explorerLink = getExplorerTransactionLink(
      notification.transaction.hash,
      notification.transaction.chainId
    );
    toast({
      id: notification.id,
      title: title,
      description: (
        <a
          href={explorerLink}
          target="_blank"
          rel="noreferrer"
          style={{ textDecoration: 'underline' }}
        >
          {notification.transaction.hash}
        </a>
      ),
      status: status,
      duration: 5000,
      isClosable: true,
      position: 'bottom-right',
    });
  }

  React.useEffect(() => {
    notifications.map((notification: any) => {
      switch (notification.type) {
      case 'transactionStarted':
        showToast('Transaction Started', 'info', notification);
        break;
      case 'transactionSucceed':
        showToast('Transaction Succeed', 'success', notification);
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
