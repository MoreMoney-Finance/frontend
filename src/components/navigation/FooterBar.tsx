import { Box, HStack, Link as LinkComponent } from '@chakra-ui/react';
import * as React from 'react';

const Links = [
  {
    title: 'Audit',
    link: 'https://github.com/MoreMoney-Finance/audits/blob/main/PeckShield-Audit-Report-Moremoney-1.0.pdf',
  },
  { title: 'Twitter', link: 'https://twitter.com/Moremoneyfi' },
  { title: 'Discord', link: 'https://discord.gg/uHwQgNE776' },
  { title: 'Telegram', link: 'https://t.me/moremoneyfi' },
  { title: 'Github', link: 'https://github.com/MoreMoney-Finance' },
  { title: 'Swap', link: 'https://avax.curve.fi/factory/39' },
];

export default function FooterBar() {
  return (
    <Box
      py={4}
      position={'absolute'}
      bottom={[-20, -10, 0]}
      right={0}
      left={[5, 10, 10]}
    >
      <HStack
        spacing={8}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        {/* <Text fontSize="12px" lineHeight="21px" color="whiteAlpha.500">
          Copyright © 2021 iMentus. All Rights Reserved
        </Text> */}
        <HStack as={'nav'} spacing={4} display={{ base: 'none', xs: 'flex' }}>
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
