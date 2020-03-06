import React, { FC } from 'react'
import reduce from 'lodash/reduce'
import map from 'lodash/map'
import padStart from 'lodash/padStart'
import toString from 'lodash/toString'
import { BorderProps, SpaceProps } from '@looker/design-tokens'
import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  ComboboxOptionObject,
} from '../Combobox'
import { ValidationType } from '../../ValidationMessage'

type formats = '12h' | '24h'
type intervals = 5 | 10 | 15 | 30

interface InputTimeSelectProps extends SpaceProps, BorderProps {
  format?: formats
  interval?: intervals
  defaultValue?: Date
  value?: Date
  onChange?: (date?: Date) => void
  validationType?: ValidationType
  onValidationFail?: (value: string) => void
}

const formatHour = (format: formats, hour: number) => {
  if (format === '12h') {
    if (hour === 0) {
      return 12
    } else if (hour > 12) {
      return hour - 12
    }
  }
  return hour
}

const generateHours = (format: formats) => {
  const hours = new Array(24)
  return map(hours, (_, index) => toString(formatHour(format, index)))
}

const generateMinuteIntervals = (interval: intervals) => {
  const minutes = new Array(60 / interval)
  return map(minutes, (_, index) => toString(index * interval))
}

export const InputTimeSelect: FC<InputTimeSelectProps> = ({
  interval = 15,
  format = '12h',
}) => {
  const hours = generateHours(format)
  const minutes = generateMinuteIntervals(interval)

  const options = reduce(
    hours,
    (result: ComboboxOptionObject[], hour: string, key) => {
      const formatLabel = key < 12 ? 'am' : 'pm'
      const options = map(minutes, (minute: string) => ({
        label: `${padStart(hour, 2, '0')}:${padStart(minute, 2, '0')}${
          format === '12h' ? ` ${formatLabel}` : ''
        }`,
        value: `${hour}:${minute}${formatLabel}`,
      }))
      return [...result, ...options]
    },
    []
  )

  return (
    <Combobox>
      <ComboboxInput placeholder="Select time" />
      <ComboboxList>
        {options.map((option, index) => (
          <ComboboxOption {...option} key={index} />
        ))}
      </ComboboxList>
    </Combobox>
  )
}
