import React, { FC } from 'react'
import { Calendar } from '../../../Calendar'

interface InputDateProps {
  prop?: any
}

export const InputDate: FC<InputDateProps> = () => {
  return <Calendar />
}
