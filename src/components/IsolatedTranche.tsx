import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/accordion";
import { Avatar, AvatarGroup } from "@chakra-ui/avatar";
import { Text } from "@chakra-ui/react";
import React from "react";
import { ParsedStratMetaRow } from "../chain-interaction/contracts";
import { addressIcons } from "../chain-interaction/tokens";

export function IsolatedTranche({
  token,
  APY,
}: React.PropsWithChildren<ParsedStratMetaRow>) {
  return (
    <AccordionItem>
      <h4>
        <AccordionButton>
          <AvatarGroup size="md" max={2}>
            {(addressIcons.get(token.address) ?? []).map((iconUrl, i) => (
              <Avatar src={iconUrl} key={i + 1} />
            ))}
          </AvatarGroup>
          <Text>{token.name}</Text>
          <Text>{APY} % APY</Text>

          <AccordionIcon />
        </AccordionButton>
      </h4>
      <AccordionPanel></AccordionPanel>
    </AccordionItem>
  );
}
