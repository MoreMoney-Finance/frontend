import {
  Text,
  Image,
  Divider,
  Avatar,
  Container,
  Flex,
} from '@chakra-ui/react';
import { useCoingeckoPrice } from '@usedapp/coingecko';
import * as React from 'react';
import { useAddresses } from '../../chain-interaction/contracts';
import { getIconsFromTokenAddress } from '../../chain-interaction/tokens';
import discordIcon from '../../assets/icons/Discord.svg';
import Github from '../../assets/icons/Github.svg';
import Twitter from '../../assets/icons/Twitter.svg';
import Vector from '../../assets/icons/Vector.svg';

const Footer: React.FC = () => {
  const addresses = useAddresses();
  const morePrice = useCoingeckoPrice('more-token', 'usd');
  const moneyPrice = useCoingeckoPrice('moremoney-usd', 'usd');

  return (
    <div>
      <Divider bg="secondary" />
      <br />
      <Flex
        justifyContent={['center', 'center', 'center', 'space-between']}
        alignItems="center"
        direction={['column', 'column', 'column', 'row']}
        gridGap={['30px', '30px', '30px', '0px']}
      >
        <Container width="full">
          <Flex gridGap="30px">
            <Image
              src={discordIcon}
              cursor="pointer"
              onClick={() =>
                window.open('https://discord.gg/uHwQgNE776', '_blank')
              }
            />
            <Image
              src={Github}
              cursor="pointer"
              onClick={() =>
                window.open('https://github.com/MoreMoney-Finance', '_blank')
              }
            />
            <Image
              src={Twitter}
              cursor="pointer"
              onClick={() =>
                window.open('https://twitter.com/Moremoneyfi', '_blank')
              }
            />
            <Image
              src={Vector}
              cursor="pointer"
              onClick={() =>
                window.open('https://moremoney.gitbook.io/docs', '_blank')
              }
            />
            <Text
              fontWeight="400"
              cursor="pointer"
              onClick={() =>
                window.open(
                  'https://github.com/MoreMoney-Finance/audits/blob/main/PeckShield-Audit-Report-Moremoney-1.0.pdf',
                  '_blank'
                )
              }
              _hover={{ textDecoration: 'underline' }}
            >
              Audit
            </Text>
          </Flex>
        </Container>
        <Container width="full">
          <Flex
            justifyContent="right"
            alignItems="center"
            direction={['column', 'column', 'column', 'row']}
            gridGap={['30px', '30px', '30px', '0px']}
          >
            <Text>Trade MORE</Text>
            <Avatar
              size={'sm'}
              ml="8px"
              src={getIconsFromTokenAddress(addresses.MoreToken)[0]}
            />
            <Text ml="8px">
              <b>${morePrice}</b>
            </Text>
            <Text ml="18px">Trade MONEY</Text>
            <Avatar
              size={'sm'}
              ml="8px"
              src={getIconsFromTokenAddress(addresses.Stablecoin)[0]}
            />
            <Text ml="8px">
              <b>${moneyPrice}</b>
            </Text>
          </Flex>
        </Container>
      </Flex>
      <br />
    </div>
  );
};

export default Footer;
