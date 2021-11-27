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
import { PercentageChoice } from './PercentageChoice';

export function TokenAmountInputField(props: {
  name: string;
  max?: CurrencyValue;
  placeholder: string;
  registerForm: (name: string, params: { required: string }) => any;
  setValueForm: (name: string, max: string) => any;
  errorsForm?: Record<string, any>;
  isDisabled?: boolean;
  percentages?: { label: string; values: Record<string, number> };
}) {
  const {
    name,
    max,
    placeholder,
    registerForm,
    setValueForm,
    errorsForm,
    isDisabled,
    percentages,
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
        <InputRightElement width="auto" mr="2">
          {max ? (
            <Button
              width="auto"
              px="2"
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
          ) : percentages ? (
            <PercentageChoice
              isDisabled={isDisabled}
              label={percentages.label}
              numButtons={Object.values(percentages.values).length}
            >
              {Object.entries(percentages.values).map(([key, value]) => (
                <Button
                  key={'percentage' + key}
                  isDisabled={isDisabled}
                  onClick={() => setValueForm(name, value.toFixed(10))}
                >
                  {key}
                </Button>
              ))}
            </PercentageChoice>
          ) : (
            ''
          )}
        </InputRightElement>
      </InputGroup>
      <FormErrorMessage>{error && error.message}</FormErrorMessage>
    </FormControl>
  );
}
