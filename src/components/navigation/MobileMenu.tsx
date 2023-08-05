import { Divider, Flex, Image, Text } from '@chakra-ui/react';
import * as React from 'react';
import money from '../../assets/mobile-menu/money.svg';
import Yield from '../../assets/mobile-menu/yield.svg';
import statistics from '../../assets/mobile-menu/statistics.svg';
import { Link } from 'react-router-dom';

const MobileMenuItem: React.FC<{ title: string; icon: string; path: string }> =
  ({ title, icon, path }) => {
    return (
      <Link to={path} style={{ textDecoration: 'none' }}>
        <Flex
          direction="column"
          alignItems="center"
          justifyContent="center"
          gridGap="10px"
          width="60px"
          cursor={'pointer'}
          _hover={{ opacity: 0.5 }}
        >
          <Image src={icon} />
          <Text>{title}</Text>
        </Flex>
      </Link>
    );
  };

const MobileMenu: React.FC = () => {
  return (
    <Flex
      width="full"
      position="fixed"
      bottom="0"
      left="0"
      display={['flex', 'flex', 'none', 'none']}
      background="rgba(0, 0, 0, 0.44)"
      boxShadow=" 0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
      backdropFilter="blur(15px)"
      borderRadius="8.938px"
      alignItems="center"
      //   height="60px"
      padding="8px"
      justifyContent="center"
    >
      <MobileMenuItem title="Borrow" icon={money} path="/" />
      <Divider transform="rotate(-90deg)" width="40px" />
      <MobileMenuItem title="Yield" icon={Yield} path="/farm" />
      <Divider transform="rotate(-90deg)" width="40px" />
      <MobileMenuItem title="Statistics" icon={statistics} path="/analytics" />
    </Flex>
  );
};

export default MobileMenu;
