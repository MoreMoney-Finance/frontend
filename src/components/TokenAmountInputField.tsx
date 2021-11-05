import * as React from 'react';
import {
  Button,
  InputRightElement,
  Input,
  InputGroup,
  FormControl,
  FormErrorMessage,
} from '@chakra-ui/react';

export function TokenAmountInputField(props: any) {
  const {
    name,
    min,
    max,
    placeholder,
    registerForm,
    setValueForm,
    showMaxButton,
    errorsForm,
  } = props;

  const error = errorsForm?.[name];

  return (
    <FormControl isInvalid={error}>
      <InputGroup size="md">
        <Input
          {...registerForm(name, {
            required: 'This is required',
            min: min,
            max: max,
          })}
          placeholder={placeholder}
          type="number"
          step="any"
        />
        {showMaxButton ? (
          <InputRightElement width="4.5rem">
            <Button size="xs" onClick={() => setValueForm(name, max)}>
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
