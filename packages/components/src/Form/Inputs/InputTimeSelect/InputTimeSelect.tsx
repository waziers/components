import React, { FC, useState } from 'react'
import reduce from 'lodash/reduce'
import map from 'lodash/map'
import padStart from 'lodash/padStart'
import toString from 'lodash/toString'
import isFunction from 'lodash/isFunction'
import find from 'lodash/find'
import { BorderProps, SpaceProps } from '@looker/design-tokens'
import {
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  ComboboxOptionObject,
} from '../Combobox'
import { ComboboxCallback, MaybeComboboxOptionObject } from '../Combobox/types'
import { ValidationType } from '../../ValidationMessage'

type formats = '12h' | '24h'
type intervals = 5 | 10 | 15 | 30

interface InputTimeSelectProps extends SpaceProps, BorderProps {
  format?: formats
  interval?: intervals
  defaultValue?: string
  value?: string
  onChange?: (val?: string) => void
  validationType?: ValidationType
  onValidationFail?: (value: string) => void
}

const cycleHourDisplay = (format: formats, hour: number) => {
  if (format === '12h') {
    if (hour === 0) {
      return 12
    } else if (hour > 12) {
      return hour - 12
    }
  }
  return hour
}

const formatTimeString = (number: number) => {
  return padStart(toString(number), 2, '0')
}

const generateMinuteIntervals = (interval: intervals) => {
  const minutes = new Array(60 / interval)
  return map(minutes, (_, index) => formatTimeString(index * interval))
}

const generateTimes = (format: formats, interval: intervals) => {
  const hours = new Array(24)
  const minutes = generateMinuteIntervals(interval)

  return reduce(
    hours,
    (result: ComboboxOptionObject[], _, index: number) => {
      const formatLabel = format === '12h' && (index < 12 ? 'am' : 'pm')
      const hour = formatTimeString(cycleHourDisplay(format, index))

      const hourWithMinutes: ComboboxOptionObject[] = map(
        minutes,
        (minute: string) => {
          const label = `${hour}:${minute} ${formatLabel || ''}`
          const value = `${formatTimeString(index)}:${minute}` // value always in 24hr time
          return {
            label,
            value,
          }
        }
      )
      return [...result, ...hourWithMinutes]
    },
    []
  )
}

const matchValueToOption = (
  options: ComboboxOptionObject[],
  format: formats,
  value?: string
) => {
  if (value) {
    const option = find(options, { value: value })

    if (option) {
      return option
    } else {
      const [hour, minute] = value.split(':')
      const formattedHour = formatTimeString(
        cycleHourDisplay(format, parseInt(hour))
      )
      const formatLabel =
        format === '12h' && (parseInt(hour) < 12 ? 'am' : 'pm')

      return { label: `${formattedHour}:${minute} ${formatLabel || ''}`, value }
    }
  }
  return undefined
}

export const InputTimeSelect: FC<InputTimeSelectProps> = ({
  interval = 15,
  format = '12h',
  onChange,
  value: propValue,
  defaultValue,
}) => {
  const timeOptions = generateTimes(format, interval)

  const [value, setValue] = useState<MaybeComboboxOptionObject>(
    matchValueToOption(timeOptions, format, propValue || defaultValue)
  )

  const handleChange: ComboboxCallback<MaybeComboboxOptionObject> = (
    newVal: MaybeComboboxOptionObject
  ) => {
    setValue(newVal)
    if (isFunction(onChange)) {
      onChange(newVal && newVal.value)
    }
  }

  return (
    <Combobox value={value} onChange={handleChange}>
      <ComboboxInput placeholder="Select time" />
      <ComboboxList>
        {timeOptions.map((option, index) => (
          <ComboboxOption {...option} key={index} />
        ))}
      </ComboboxList>
    </Combobox>
  )
}
