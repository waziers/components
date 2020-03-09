import React, { FC } from 'react'
import styled from 'styled-components'

import {
  BorderProps,
  SpaceProps,
  border,
  space,
  reset,
} from '@looker/design-tokens'
import {
  InputText,
  inputTextHover,
  inputTextFocus,
  inputTextDisabled,
  inputTextValidation,
  inputTextDefaults,
  CustomizableInputTextAttributes,
} from '../InputText'
import { ValidationType } from '../../ValidationMessage'

interface InputTimeProps extends SpaceProps, BorderProps {
  format?: '12h' | '24h'
  defaultValue?: string
  value?: string
  onChange?: (time?: string) => void
  validationType?: ValidationType
  onValidationFail?: (value: string) => void
}

export const InputTime: FC<InputTimeProps> = () => {
  return (
    <InputTimeWrapper>
      <InputTimeLayout>
        <InputText maxLength={2} placeholder="HH" />
        <div>:</div>
        <InputText maxLength={2} placeholder="MM" />
        <InputText maxLength={2} placeholder="PM" />
      </InputTimeLayout>
    </InputTimeWrapper>
  )
}

const InputTimeWrapper = styled.div.attrs({
  ...inputTextDefaults,
  ...CustomizableInputTextAttributes,
})`
  ${reset}
  ${border}
  ${space}

  display: inline-block;

  &:hover {
    ${inputTextHover}
  }

  &:focus-within {
    ${inputTextFocus}
  }

  &:disabled {
    ${inputTextDisabled}
  }

  ${inputTextValidation}

  ${InputText} {
    border: none;
    border-radius: 0;
    padding: 0;
    margin: 0;
    box-shadow: none;
    background: transparent;
    width: 1.5rem;
    &:last-child {
      margin-left: ${({ theme }) => theme.space.xsmall};
    }
  }
`

const InputTimeLayout = styled.div`
  display: grid;
  grid-gap: 0.25rem;
  grid-template-columns: 1fr auto 1fr 2fr;
  align-items: center;
`
