import * as React from 'react';
import { Box, HStack, Link as LinkComponent } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const Links = [
  { title: 'Facebook', link: '/' },
  { title: 'Twitter', link: '/' },
  { title: 'Instagram', link: '/' },
];

export default function FooterBar() {
  return (
    <Box py={10}>
      <HStack
        spacing={8}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        {/* <Text fontSize="12px" lineHeight="21px" color="whiteAlpha.500">
          Copyright © 2021 iMentus. All Rights Reserved
        </Text> */}
        <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
          {Links.map((link) => (
            <LinkComponent variant="footer" key={link.title}>
              <Link to={link.link}>{link.title}</Link>
            </LinkComponent>
          ))}
        </HStack>
      </HStack>
    </Box>
  );
}
