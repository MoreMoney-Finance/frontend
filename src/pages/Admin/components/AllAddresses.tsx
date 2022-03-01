import {
  Accordion,
  AccordionItem,
  AccordionButton,
  Box,
  AccordionIcon,
  AccordionPanel,
} from '@chakra-ui/react';
import { useEthers, getExplorerAddressLink } from '@usedapp/core';
import * as React from 'react';
import { useAddresses } from '../../../chain-interaction/contracts';

export default function AllAddresses(props: React.PropsWithChildren<unknown>) {
  const addresses = useAddresses();
  const { chainId } = useEthers();

  return (
    <div>
      <Accordion allowMultiple>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Addresses.json
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <div>
              <ul>
                {Object.entries(addresses).map(([key, value]) => (
                  <li key={key}>
                    <a
                      href={getExplorerAddressLink(value, chainId!)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {key}
                    </a>
                  </li>
                ))}
              </ul>
              {props.children}
            </div>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      {props.children}
    </div>
  );
}
