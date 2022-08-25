import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Image,
  Link as LinkComponent,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo/logo.png';
import AccountModal from '../account/AccountModal';
import { UserAddressComponent } from '../account/UserAddressComponent';
import MenuOptions from './MenuOptions';
import { useMediaQuery } from '@chakra-ui/react';

const Links = [
  { title: '', link: '/' },
  // { title: 'My Positions', link: '/positions' },
  // { title: 'Farm', link: '/farm' },
  // { title: 'Stake', link: '/stake' },
  // // { title: 'Liquidate', link: '/liquidatable-positions' },
  // { title: 'Analytics', link: '/analytics' },
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
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <Link to="/">
            <Flex alignItems={'center'}>
              <Image src={logo} alt="Logo" width={['30px', '40px', '50px']} />
              &nbsp;
              {isLargerThan1280 ? (
                <Text fontSize={['sm', 'md', 'lg']}>
                  <b>moremoney</b>
                </Text>
              ) : (
                ''
              )}
            </Flex>
          </Link>
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
            <MenuOptions />
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
