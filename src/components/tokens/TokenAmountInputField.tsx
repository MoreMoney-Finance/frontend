import {
  Button, FormControl,
  FormErrorMessage, Input,
  InputGroup, InputRightElement, Text
} from '@chakra-ui/react';
import { CurrencyValue } from '@usedapp/core';
import * as React from 'react';

export function TokenAmountInputField(props: {
  name: string;
  max?: CurrencyValue;
  placeholder: string;
  registerForm: (name: string, params: { required: string }) => any;
  setValueForm: (
    name: string,
    max: string,
    args?: { shouldDirty: boolean; shouldTouch: boolean }
  ) => any;
  errorsForm?: Record<string, any>;
  isDisabled?: boolean;
  percentage?: string;
  width?: string;
}) {
  const {
    name,
    max,
    placeholder,
    registerForm,
    setValueForm,
    errorsForm,
    isDisabled,
    percentage,
    width = '200px',
  } = props;

  const error = errorsForm?.[name];

  return (
    <FormControl
      isInvalid={error}
      isDisabled={isDisabled}
      borderRadius={'10px'}
      w={width}
      bg={'brand.bgOpacity'}
    >
      <InputGroup>
        <Input
          {...registerForm(name, {
            required: '',
          })}
          placeholder={placeholder}
          type="text"
          inputMode="numeric"
          step="any"
          autoComplete="off"
          autoCorrect="off"
          defaultValue={0}
          minLength="1"
          maxLength="79"
          spellCheck="false"
          pattern="^[0-9][.,]?[0-9]$"
          border={'none'}
          h={'44px'}
        />
        <InputRightElement width="auto" padding={'10px'}>
          {max ? (
            <Button
              variant={'primary'}
              width="auto"
              padding={'4px 12px'}
              margin={'auto 0'}
              size="xs"
              borderRadius={'3px'}
              isDisabled={isDisabled}
              onClick={() =>
                setValueForm(
                  name,
                  max.format({
                    significantDigits: Infinity,
                    prefix: '',
                    suffix: '',
                    thousandSeparator: '',
                    decimalSeparator: '.',
                  }),
                  { shouldDirty: true, shouldTouch: true }
                )
              }
            >
              <Text
                variant={'bodyExtraSmall'}
                color={'brand.bg'}
                fontWeight={'500'}
              >
                MAX
              </Text>
            </Button>
          ) : percentage ? (
            <Button
              variant={'primary'}
              isDisabled={true}
              width="auto"
              padding={'4px 12px'}
              margin={'auto 0'}
              borderRadius={'3px'}
              size="xs"
            >
              <Text
                variant={'bodyExtraSmall'}
                color={'brand.bg'}
                fontWeight={'500'}
              >
                {percentage}
              </Text>
            </Button>
          ) : (
            <></>
          )}
        </InputRightElement>
      </InputGroup>
      <FormErrorMessage>{error && error.message}</FormErrorMessage>
    </FormControl>
  );
}
