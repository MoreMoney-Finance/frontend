import { Flex, Text } from '@chakra-ui/react';
import { ChainId, getExplorerTransactionLink } from '@usedapp/core';
import * as React from 'react';
import { Slide, toast } from 'react-toastify';
import infoIcon from '../../assets/icons/alert-octagon.svg';
import successIcon from '../../assets/icons/check-circle.svg';
import errorIcon from '../../assets/icons/x-circle.svg';

const ToastBody: React.FC<{ icon: string; title: string; hash: string }> = ({
  icon,
  title,
  hash,
}) => {
  return (
    <Flex
      cursor="pointer"
      onClick={() => {
        window.open(hash, '_blank');
      }}
    >
      <img src={icon} />
      <Flex direction="column" pl="4">
        <Text fontSize="16px" color="white">
          <b>{title}</b>
        </Text>
        <Text color="white">{hash}</Text>
      </Flex>
    </Flex>
  );
};

export function showToast(
  icon: 'success' | 'info' | 'error',
  hash: string,
  chainId: ChainId,
  title = undefined
) {
  const toastIcon = {
    success: successIcon,
    info: infoIcon,
    error: errorIcon,
  };

  const toastMessage = {
    success: 'Transaction Succeeded',
    info: 'Transaction Rejected',
    error: 'Transaction Failed',
  };

  const explorerLink = getExplorerTransactionLink(hash, chainId);

  toast(
    <ToastBody
      icon={toastIcon[icon]}
      title={title ?? toastMessage[icon]}
      hash={explorerLink}
    />,
    {
      position: 'bottom-right',
      autoClose: 999999,
      closeButton: false,
      className: 'toastify-custom',
      icon: true,
      hideProgressBar: true,
      closeOnClick: true,
      transition: Slide,
    }
  );
}
