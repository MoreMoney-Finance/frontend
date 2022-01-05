import { Box, HStack, Link as LinkComponent } from '@chakra-ui/react';
import * as React from 'react';

const Links = [
  { title: 'Twitter', link: 'https://twitter.com/Moremoneyfi' },
  { title: 'Discord', link: 'https://discord.gg/uHwQgNE776' },
  { title: 'Github', link: 'https://github.com/MoreMoney-Finance' },
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
              <a href={link.link} target={'_blank'} rel="noreferrer">
                {link.title}
              </a>
            </LinkComponent>
          ))}
        </HStack>
      </HStack>
    </Box>
  );
}
