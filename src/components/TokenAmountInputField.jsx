import * as React from 'react';
import { Button, InputRightElement, Input, InputGroup } from '@chakra-ui/react';

export function TokenAmountInputField(props) {
  const {
    name,
    min,
    max,
    placeholder,
    registerForm,
    setValueForm,
    showMaxButton,
  } = props;

  return (
    <InputGroup size="md">
      <Input
        {...registerForm(name, {
          required: 'This is required',
          min: min,
          max: max,
        })}
        placeholder={placeholder}
        type="number"
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
  );
}
