import { HamburgerIcon } from '@chakra-ui/icons';
import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
} from '@chakra-ui/react';
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
  { title: 'Documentation', link: 'https://moremoney.gitbook.io/docs' },
  {
    title: 'Trade MORE',
    link: 'https://traderjoexyz.com/trade?inputCurrency=AVAX&outputCurrency=0xd9d90f882cddd6063959a9d837b05cb748718a05',
  },
  { title: 'Trade MONEY (Curve)', link: 'https://avax.curve.fi/factory/39' },
  {
    title: 'Trade MONEY (Pangolin)',
    link: 'https://app.pangolin.exchange/#/swap?inputCurrency=AVAX&outputCurrency=0x0f577433Bf59560Ef2a79c124E9Ff99fCa258948',
  },
  {
    title: 'MORE-AVAX LP',
    link: 'https://traderjoexyz.com/pool/AVAX/0xd9D90f882CDdD6063959A9d837B05Cb748718A05#/',
  },
  {
    title: 'MONEY-AVAX LP',
    link: 'https://app.pangolin.exchange/#/add/AVAX/0x0f577433Bf59560Ef2a79c124E9Ff99fCa258948',
  },
  {
    title: 'MONEY-Stable LP',
    link: 'https://avax.curve.fi/factory/39/deposit',
  },
];

export default function MenuOptions() {
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<HamburgerIcon />}
        variant="outline"
      />
      <Portal>
        <MenuList zIndex="dropdown">
          {Links.map((link, index) => (
            <a
              href={link.link}
              target={'_blank'}
              rel="noreferrer"
              key={'option' + index}
            >
              <MenuItem>{link.title}</MenuItem>
            </a>
          ))}
        </MenuList>
      </Portal>
    </Menu>
  );
}
