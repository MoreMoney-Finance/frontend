import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from "@chakra-ui/accordion";
import { Avatar, AvatarGroup } from "@chakra-ui/avatar";
import { Button, FormControl, HStack, InputRightElement, NumberInput, NumberInputField, Text } from "@chakra-ui/react";
import React from "react";
import { ParsedStratMetaRow } from "../chain-interaction/contracts";
import { addressIcons } from "../chain-interaction/tokens";
import { useWalletBalance } from "./WalletBalancesContext";
import { useForm } from 'react-hook-form';

export function IsolatedTranche({
  token,
  APY,
  strategyName
}: React.PropsWithChildren<ParsedStratMetaRow>) {

  const { handleSubmit, /*watch,*/ register, formState: { errors, isSubmitting } } = useForm();

  const tokenBalance = parseFloat((useWalletBalance(token.address) ?? '0').toString());

  function onDepositBorrow() {
    console.log(`deposit and borrow`);
  }
  return (
    <AccordionItem>
      <h4>
        <AccordionButton>
          <HStack spacing="0.5rem">
            <AvatarGroup size="sm" max={2}>
              {(addressIcons.get(token.address) ?? []).map((iconUrl, i) => (
                <Avatar src={iconUrl} key={i + 1} />
              ))}
            </AvatarGroup>
            <Text>{token.name}</Text>
            <Text>{strategyName}</Text>
            <Text>{APY.toPrecision(4)} % APY</Text>
            <AccordionIcon />
          </HStack>
        </AccordionButton>
      </h4>

      <AccordionPanel>
        <form onSubmit={handleSubmit(onDepositBorrow)}>
          <FormControl isInvalid={errors.name}>
            <HStack spacing="0.5rem">
              <NumberInput min={0} max={tokenBalance}>
                <NumberInputField {
                  ...register('collateral-deposit', {
                    required: 'This is required',
                    min: 0,
                    max: tokenBalance
                  })
                } placeholder={'Collateral deposit'}>

                </NumberInputField>
                <InputRightElement width="4.5rem">
                  <Button size="xs">MAX</Button>
                </InputRightElement>
              </NumberInput>


              <NumberInput min={0}>
                <NumberInputField {
                  ...register('usdm-borrow', {
                    required: 'This is required',
                    min: 0
                  })
                } placeholder={'USDm borrow'}>

                </NumberInputField>
              </NumberInput>

              <Button type="submit" isLoading={isSubmitting}>Deposit &amp; Borrow</Button>

            </HStack>
          </FormControl>
        </form>
      </AccordionPanel>
    </AccordionItem>
  );
}
