import React, { FC } from 'react'
import DayPicker from 'react-day-picker'
import 'react-day-picker/lib/style.css'

interface InputDateProps {
  prop?: any
}

export const InputDate: FC<InputDateProps> = () => {
  return <DayPicker />
}
