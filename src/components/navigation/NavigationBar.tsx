import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
  Box,
  Text,
  Avatar,
  Flex,
  HStack,
  IconButton,
  Image,
  Link as LinkComponent,
  Stack,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo/logo.svg';
import AccountModal from '../account/AccountModal';
import { UserAddressComponent } from '../account/UserAddressComponent';

const Links = [
  { title: 'Borrow', link: '/' },
  // { title: 'My Positions', link: '/positions' },
  { title: 'Yield', link: 'https://app.moremoney.finance/farm' },
  // { title: 'Stake', link: '/stake' },
  // { title: 'Liquidate', link: '/liquidatable-positions' },
  { title: 'Statistics', link: '/analytics' },
];

export default function NavigationBar() {
  const [isLargerThan1280] = useMediaQuery('(min-width: 1280px)');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenAccount,
    onOpen: onOpenAccount,
    onClose: onCloseAccount,
  } = useDisclosure();
  const location = useLocation();

  return (
    <>
      <Box position="relative" zIndex="var(--chakra-zIndices-header)">
        <Flex
          alignItems={'center'}
          padding="40px 0 0"
          justifyContent={'space-between'}
        >
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none', base: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <Link to="/">
            <Flex alignItems={'center'}>
              <Image src={logo} alt="Logo" width={'300px'} ml="8px" />
            </Flex>
          </Link>
          <HStack
            as={'nav'}
            spacing="48px"
            ml="66px"
            display={{ base: 'none', md: 'flex' }}
            width="100%"
          >
            {Links.map((link) => (
              <LinkComponent
                variant={
                  location.pathname === link.link ? 'headerActive' : 'header'
                }
                key={link.title}
              >
                {link.title === 'Yield' ? (
                  <a href={link.link} target="_blank" rel="noopener noreferrer">
                    {link.title}
                  </a>
                ) : (
                  <Link to={link.link}>{link.title}</Link>
                )}
              </LinkComponent>
            ))}
          </HStack>
          <HStack
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
          >
            <Flex
              background="rgba(255, 255, 255, 0.15)"
              paddingLeft="10px"
              paddingRight="10px"
              paddingTop="6px"
              paddingBottom="6px"
              borderRadius="6px"
              alignItems="center"
              h={'37px'}
            >
              <Avatar width="20px" height="20px">
                <img src="https://upload.wikimedia.org/wikipedia/en/0/03/Avalanche_logo_without_text.png" />
              </Avatar>
              {isLargerThan1280 && (
                <Text fontSize="16px" ml="8px" color="white" fontWeight="400">
                  Avalanche
                </Text>
              )}
            </Flex>
            <UserAddressComponent handleOpenModal={onOpenAccount} />
            <AccountModal isOpen={isOpenAccount} onClose={onCloseAccount} />
          </HStack>
        </Flex>
        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map((link) => (
                <LinkComponent
                  variant={
                    location.pathname === link.link ? 'headerActive' : 'header'
                  }
                  key={link.title}
                >
                  <Link to={link.link}>{link.title}</Link>
                </LinkComponent>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
