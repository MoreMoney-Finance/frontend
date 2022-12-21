import * as React from 'react';
import { Container, Flex, GridItem, Text, VStack } from '@chakra-ui/react';
import { ExternalMetadataContext } from '../../../contexts/ExternalMetadataContext';

export default function NftTiersInformation() {
  const { tiersJson } = React.useContext(ExternalMetadataContext);
  console.log('tiersJson', tiersJson);

  return (
    <GridItem colSpan={[12, 12, 3, 3]} rowSpan={[12, 12, 3, 3]}>
      <Container variant={'token'} position="relative" padding={'16px'}>
        <Flex
          flexDirection={['column', 'column', 'row']}
          padding={['20px', '35px', '20px']}
          justifyContent="space-between"
          alignItems={'center'}
        >
          <Flex flexGrow={'1'} direction={['column', 'column', 'column']}>
            <Text variant={'bodyLarge'}>Introducing Position NFTs</Text>
            <Text variant="h400" color={'whiteAlpha.700'}>
              <br />
              Using NFTs as collateral for a CDP has several potential benefits.
            </Text>
          </Flex>
          <Flex
            flexGrow={'3'}
            ml="16px"
            justifyContent={'space-between'}
            direction={['column', 'column', 'row']}
          >
            {[1, 2, 3, 4, 5, 6, 7].map((tier: number, index: number) => (
              <VStack
                key={`tier${index}`}
                spacing={['10px', '0px', '20px']}
                align="center"
                margin={['16px', '16px', '0px']}
              >
                <Text variant="h400" color={'whiteAlpha.700'}>
                  {'Tier ' + tier}
                </Text>
                <Text variant="bodySmall">{'100'}</Text>
                <Text variant="bodySmall">{'available'}</Text>
              </VStack>
            ))}
          </Flex>
        </Flex>
      </Container>
    </GridItem>
  );
}
