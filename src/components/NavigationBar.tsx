import * as React from 'react';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  useDisclosure,
  Stack,
  Image,
  Link as LinkComponent,
} from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import { UserAddressComponent } from './UserAddressComponent';
import AccountModal from './AccountModal';
import logo from '../assets/logo/logo.svg';

const Links = [
  { title: 'Borrow', link: '/' },
  { title: 'Farm', link: '/farm' },
  { title: 'My Positions', link: '/positions' },
  { title: 'Liquidation Protected Loans', link: '/loans' },
  { title: 'Analytics', link: '/analytics' },
];

export default function NavigationBar() {
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
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <Box>
            <Image src={logo} alt="Logo" />
          </Box>
          <HStack
            as={'nav'}
            spacing="48px"
            display={{ base: 'none', md: 'flex' }}
          >
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
          </HStack>
          <HStack
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
          >
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
