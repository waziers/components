import React, { FC, useState, useEffect } from 'react'
import styled from 'styled-components'
import reduce from 'lodash/reduce'
import map from 'lodash/map'
import padStart from 'lodash/padStart'
import toString from 'lodash/toString'
import isFunction from 'lodash/isFunction'
import find from 'lodash/find'
import trim from 'lodash/trim'
import last from 'lodash/last'
import head from 'lodash/head'
import sortedIndex from 'lodash/sortedIndex'
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
    (result: ComboboxOptionObject[], _, hour: number) => {
      const formatLabel = format === '12h' && (hour < 12 ? 'am' : 'pm')
      const formattedHour = formatTimeString(cycleHourDisplay(format, hour))

      const hourWithMinutes: ComboboxOptionObject[] = map(
        minutes,
        (minute: string) => {
          const label = trim(`${formattedHour}:${minute} ${formatLabel || ''}`)
          const value = `${formatTimeString(hour)}:${minute}` // value always in 24hr time
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

const parseBase10Int = (value: string) => parseInt(value, 10)

const matchClosestMinute = (interval: intervals, timeCode?: string) => {
  const minuteOptions = map(generateMinuteIntervals(interval), parseBase10Int)
  const now = new Date()
  const currentMinute = timeCode
    ? parseBase10Int(timeCode.split(':')[1])
    : now.getMinutes()
  const currentHour = timeCode
    ? parseBase10Int(timeCode.split(':')[0])
    : now.getHours()

  // round current minute to closest option
  const index = sortedIndex(minuteOptions, currentMinute)
  const optionBefore =
    minuteOptions[index - 1] || (head(minuteOptions) as number)
  const optionAfter = minuteOptions[index] || (last(minuteOptions) as number)
  const roundedMinute =
    currentMinute - optionBefore < optionAfter - currentMinute
      ? optionBefore
      : optionAfter

  // format and return time string
  const formattedHour = formatTimeString(currentHour)
  const formattedMinute = formatTimeString(roundedMinute)

  return `${formattedHour}:${formattedMinute}`
}

const isValidTimeInput = (value?: string) => {
  if (!value) {
    return true
  }
  const [hour, minute] = map(value.split(':'), parseBase10Int)

  if (hour < 24 && minute <= 60) {
    return true
  }

  return false
}

const matchStringValueToOption = (
  options: ComboboxOptionObject[],
  format: formats,
  value?: string
) => {
  if (value && isValidTimeInput(value)) {
    const option = find(options, { value: value })

    if (option) {
      return option
    } else {
      const [hour, minute] = map(value.split(':'), parseBase10Int)
      const formattedHour = formatTimeString(cycleHourDisplay(format, hour))
      const formattedMinute = formatTimeString(minute)
      const formatLabel = format === '12h' && (hour < 12 ? 'am' : 'pm')

      return {
        label: `${formattedHour}:${formattedMinute} ${formatLabel || ''}`,
        value,
      }
    }
  }
  return undefined
}

// choose one option to scroll into visible menu area
const setScrollIntoView = (
  options: ComboboxOptionObject[],
  interval: intervals,
  selectedOption?: ComboboxOptionObject
) => {
  // CASE 1: scroll currently selected option into view
  if (selectedOption) {
    return map(options, option =>
      matchClosestMinute(interval, selectedOption.value) === option.value
        ? { ...option, scrollIntoView: true }
        : option
    )
  }

  // CASE 2: scroll current time into view
  const now = matchClosestMinute(interval)
  return map(options, option =>
    option.value === now ? { ...option, scrollIntoView: true } : option
  )
}

export const InputTimeSelect: FC<InputTimeSelectProps> = ({
  interval = 15,
  format = '12h',
  onChange,
  value = '',
  defaultValue,
}) => {
  if (!isValidTimeInput(value) || !isValidTimeInput(defaultValue)) {
    // eslint-disable-next-line no-console
    console.error(
      `Invalid time (${value ||
        defaultValue}) passed to <InputTimeSelect />. Value should be formatted as a 24-hour string (e.g. value="02:00" or value="23:15").`
    )
  }

  const timeOptions = generateTimes(format, interval)

  const [selectedOption, setSelectedOption] = useState<
    MaybeComboboxOptionObject
  >()

  useEffect(() => {
    setSelectedOption(
      matchStringValueToOption(timeOptions, format, value || defaultValue)
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const handleChange: ComboboxCallback<MaybeComboboxOptionObject> = (
    newSelectedOption: MaybeComboboxOptionObject
  ) => {
    setSelectedOption(newSelectedOption)
    const newValue = newSelectedOption ? newSelectedOption.value : undefined
    if (isFunction(onChange) && isValidTimeInput(newValue)) {
      onChange(newValue)
    }
  }

  const timeOptionsFocused = setScrollIntoView(
    timeOptions,
    interval,
    selectedOption || { value }
  )

  return (
    <InputTimeSelectWrapper>
      <Combobox value={selectedOption} onChange={handleChange}>
        <ComboboxInput placeholder="Select time" />
        <ComboboxList persistSelection>
          {timeOptionsFocused.map((option, index) => (
            <ComboboxOption {...option} key={index} />
          ))}
        </ComboboxList>
      </Combobox>
    </InputTimeSelectWrapper>
  )
}

const InputTimeSelectWrapper = styled.div`
  display: inline-block;
`
