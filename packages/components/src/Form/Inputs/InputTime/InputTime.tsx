import React, { FC } from 'react'
import { BorderProps, SpaceProps } from '@looker/design-tokens'
import { InputText } from '../InputText'
import { ValidationType } from '../../ValidationMessage'

interface InputTimeProps extends SpaceProps, BorderProps {
  format?: '12h' | '24h'
  defaultValue?: Date
  value?: Date
  onChange?: (date?: Date) => void
  validationType?: ValidationType
  onValidationFail?: (value: string) => void
}

export const InputTime: FC<InputTimeProps> = () => {
  return <InputText />
}
