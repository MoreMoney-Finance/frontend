import { Alert, AlertIcon } from '@chakra-ui/react';
import * as React from 'react';
import { useParams } from 'react-router-dom';
import { deprecatedTokenList } from '../../constants/deprecated-token-list';

export default function DeprecatedTokenMessage() {
  const params = useParams<'tokenAddress'>();
  const isDeprecated = deprecatedTokenList.includes(params.tokenAddress ?? '');

  return (
    <>
      {isDeprecated ? (
        <>
          <Alert
            status="error"
            justifyContent={'center'}
            fontSize={'lg'}
            borderRadius={'full'}
          >
            <AlertIcon />
            <b>This token has been deprecated, you can repay, but not borrow against it.</b>
          </Alert>
          <br />
        </>
      ) : (
        ''
      )}
    </>
  );
}
