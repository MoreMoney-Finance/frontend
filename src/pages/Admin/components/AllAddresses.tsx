import {
  Accordion,
  AccordionItem,
  AccordionButton,
  Box,
  AccordionIcon,
  AccordionPanel,
  Button,
} from '@chakra-ui/react';
import { useEthers, getExplorerAddressLink } from '@usedapp/core';
import * as React from 'react';
import { useAddresses } from '../../../chain-interaction/contracts';
import CopyClipboard from './CopyClipboard/CopyClipboard';

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
              <table>
                <thead>
                  <th>Deployment Name</th>
                  <th>Copy Clipboard</th>
                  <th>Fees</th>
                </thead>
                <tbody>
                  {Object.entries(addresses).map(([key, value]) => (
                    <tr key={value}>
                      <td>
                        <a
                          href={getExplorerAddressLink(value, chainId!)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {key}
                        </a>
                      </td>
                      <td>
                        <CopyClipboard value={value.toString()} />
                      </td>
                      <td>
                        <Button>Withdraw Fees</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <ul></ul>
              {props.children}
            </div>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      {props.children}
    </div>
  );
}
