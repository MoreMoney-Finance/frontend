import { Box, Container, GridItem } from '@chakra-ui/react';
import * as React from 'react';
import {
  ParsedPositionMetaRow,
  ParsedStratMetaRow,
} from '../../../../chain-interaction/contracts';
import DepositBorrow from './DepositBorrow';
import Withdraw from './Withdraw';

export default function EditPosition({
  position,
  stratMeta,
}: React.PropsWithChildren<{
  position?: ParsedPositionMetaRow;
  stratMeta: ParsedStratMetaRow;
}>) {
  return (
    <GridItem rowSpan={[12, 12, 2]} colSpan={[12, 12, 1]}>
      <Box h="50%" paddingBottom="10px">
        <Container variant={'token'} padding={'65px 20px 20px 20px'}>
          <DepositBorrow position={position} stratMeta={stratMeta} />
        </Container>
      </Box>
      <Box h="50%">
        <Container variant={'token'} padding={'65px 20px 20px 20px'}>
          <Withdraw position={position} stratMeta={stratMeta} />
        </Container>
      </Box>
    </GridItem>
  );
}
