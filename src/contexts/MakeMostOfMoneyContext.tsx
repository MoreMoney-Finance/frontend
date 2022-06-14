import {
  Container,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import * as React from 'react';
import { Link } from 'react-router-dom';

export const MakeMostOfMoneyContext = React.createContext({} as any);

export default function MakeMostOfMoneyCtxProvider({
  children,
}: React.PropsWithChildren<any>) {
  const { isOpen, onToggle, onClose } = useDisclosure();

  function MostOfMoneyPopover({ children }: { children: React.ReactNode }) {
    return (
      <>
        <Popover
          returnFocusOnClose={false}
          isOpen={true}
          onClose={onClose}
          placement="bottom"
          closeOnBlur={false}
          boundary="scrollParent"
          computePositionOnMount={true}
          matchWidth={true}
        >
          <PopoverTrigger>{children}</PopoverTrigger>
          <PopoverContent
            background="transparent"
            border={'none'}
            width="400px"
          >
            <Container variant="token" paddingLeft={'22px'} paddingRight="22px">
              <PopoverHeader fontWeight="semibold" padding={'16px'}>
                Make the MOST of your MONEY
              </PopoverHeader>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverBody padding={'32px'}>
                <ul>
                  <li>
                    <Text>
                      Trade MONEY on{' '}
                      <a
                        href="https://app.platypus.finance/swap"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Text as="u">Platypus</Text>,{' '}
                      </a>
                      <a
                        href="https://traderjoexyz.com/trade?inputCurrency=AVAX&outputCurrency=0x0f577433bf59560ef2a79c124e9ff99fca258948"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Text as="u">Trader Joe</Text>
                      </a>
                      , or{' '}
                      <a
                        href="https://app.pangolin.exchange/#/swap"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Text as="u">Pangolin.</Text>
                      </a>
                    </Text>
                  </li>
                  <br />
                  <li>
                    <Text>
                      Provide liquidity on{' '}
                      <a
                        href="https://app.platypus.finance/pool?pool_group=factory"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Text as="u">Platypus</Text>,{' '}
                      </a>
                      <a
                        href="https://traderjoexyz.com/pool/0x0f577433bf59560ef2a79c124e9ff99fca258948/AVAX"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Text as="u">Trader Joe</Text>
                      </a>
                      , or{' '}
                      <a
                        href="https://app.pangolin.exchange/#/add/AVAX/0x0f577433Bf59560Ef2a79c124E9Ff99fCa258948"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Text as="u">Pangolin.</Text>
                      </a>
                    </Text>
                  </li>
                  <br />
                  <li>
                    <Link to="/imoney">
                      <Text as="u">Stake MONEY</Text>
                    </Link>{' '}
                    to earn interest using iMONEY.
                  </li>
                </ul>
              </PopoverBody>
            </Container>
          </PopoverContent>
        </Popover>
      </>
    );
  }

  return (
    <MakeMostOfMoneyContext.Provider
      value={{ onToggle, isOpen, onClose, MostOfMoneyPopover }}
    >
      {children}
    </MakeMostOfMoneyContext.Provider>
  );
}
