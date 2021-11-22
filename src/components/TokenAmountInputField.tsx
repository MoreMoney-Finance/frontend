import * as React from 'react';
import {
  Button,
  InputRightElement,
  Input,
  InputGroup,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react';
import { CurrencyValue } from '@usedapp/core';

export function TokenAmountInputField(props: {
  name: string;
  max?: CurrencyValue;
  placeholder: string;
  registerForm: (name: string, params: { required: string }) => any;
  setValueForm: (name: string, max: string) => any;
  errorsForm?: Record<string, any>;
  isDisabled?: boolean;
}) {
  const {
    name,
    max,
    placeholder,
    registerForm,
    setValueForm,
    errorsForm,
    isDisabled,
  } = props;

  const error = errorsForm?.[name];

  return (
    <FormControl isInvalid={error} isDisabled={isDisabled}>
      <InputGroup size="md">
        <Input
          {...registerForm(name, {
            required: 'This is required',
          })}
          placeholder={placeholder}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          autoCorrect="off"
          defaultValue={0}
          pattern="^[0-9]*[.,]?([0-9]?)*$"
        />
        {max ? (
          <InputRightElement width="4.5rem">
            <Button
              size="xs"
              isDisabled={isDisabled}
              onClick={() =>
                setValueForm(
                  name,
                  max.format({
                    significantDigits: Infinity,
                    prefix: '',
                    suffix: '',
                  })
                )
              }
            >
              MAX
            </Button>
          </InputRightElement>
        ) : (
          ''
        )}
      </InputGroup>
      <FormErrorMessage>{error && error.message}</FormErrorMessage>
    </FormControl>
  );
}
