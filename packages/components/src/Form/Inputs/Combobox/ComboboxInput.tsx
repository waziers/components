/*

 MIT License

 Copyright (c) 2019 Looker Data Sciences, Inc.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.

 */

// Much of the following is pulled from https://github.com/reach/reach-ui
// because their work is fantastic (but is not in TypeScript)

import { CaretDown } from '@looker/icons'
import React, {
  FormEvent,
  forwardRef,
  useLayoutEffect,
  useRef,
  useContext,
  Ref,
} from 'react'
import ReactDOMServer from 'react-dom/server'
import styled, { css } from 'styled-components'
import { useForkedRef, useWrapEvent } from '../../../utils'
import { InputSearch, InputSearchProps } from '../InputSearch'
import { InputChips, InputChipsProps } from '../InputChips'
import { InputText } from '../InputText'
import { makeHash, useBlur, useKeyDown } from './helpers'
import { ComboboxContext } from './ComboboxContext'
import { getComboboxText } from './ComboboxOption'
import { ComboboxActionType, ComboboxState } from './state'

export interface ComboboxSpecificInputProps {
  /**
   * If true, when the user clicks inside the text box the current value will
   * be selected. Use this if the user is likely to delete all the text anyway
   * (like the URL bar in browsers).
   *
   * However, if the user is likely to want to tweak the value, leave this
   * false, like a google search--the user is likely wanting to edit their
   * search, not replace it completely.
   */
  selectOnClick?: boolean
  /**
   * Determines if the value in the input changes or not as the user navigates
   * with the keyboard. If true, the value changes, if false the value doesn't
   * change.
   *
   * Set this to false when you don't really need the value from the input but
   * want to populate some other state (like the recipient selector in an email client).
   * But if your input is more like a normal `<input type="text"/>`, then leave
   * the `true` default.
   */
  autoComplete?: boolean
}

export interface ComboboxInputProps
  extends ComboboxSpecificInputProps,
    Omit<InputSearchProps, 'autoComplete'> {}

export interface ComboboxInputChipsProps
  extends ComboboxSpecificInputProps,
    Omit<InputChipsProps, 'autoComplete'> {}

type InputChangeHandler<T> = (e: T) => void

export interface UseComboboxInputProps<
  T extends string | FormEvent<HTMLInputElement>
> extends Omit<ComboboxInputProps, 'value' | 'onChange'> {
  inputValue?: string
  onInputChange?: InputChangeHandler<T>
}

function useComboboxInput<T extends string | FormEvent<HTMLInputElement>>(
  {
    // highlights all the text in the box on click when true
    selectOnClick = false,

    // updates the value in the input when navigating w/ the keyboard
    autoComplete = true,
    readOnly = false,

    // wrapped events
    onClick,
    onInputChange,
    onMouseDown,
    onClear,
    onKeyDown,
    onBlur,
    onFocus,

    // might be controlled
    inputValue: controlledValue,
    ...props
  }: UseComboboxInputProps<T>,
  forwardedRef: Ref<HTMLInputElement>
): [
  Omit<UseComboboxInputProps<T>, 'autoComplete' | 'selectOnClick'>,
  Ref<HTMLInputElement>
] {
  const {
    data: {
      navigationOption,
      option,
      lastActionType,
      inputValue: contextInputValue,
    },
    onChange: contextOnChange,
    inputCallbackRef,
    inputElement,
    state,
    transition,
    listboxId,
    autoCompletePropRef,
    persistSelectionRef,
    readOnlyPropRef,
    openOnFocus,
  } = useContext(ComboboxContext)

  const ref = useForkedRef<HTMLInputElement>(inputCallbackRef, forwardedRef)

  // Because we close the List on blur, we need to track if the blur is
  // caused by clicking inside the list, and if so, don't close the List.
  const selectOnClickRef = useRef(false)

  const handleKeyDown = useKeyDown()

  const handleBlur = useBlur()

  const isControlled = controlledValue !== undefined

  useLayoutEffect(() => {
    if (autoCompletePropRef) autoCompletePropRef.current = autoComplete
    if (readOnlyPropRef) readOnlyPropRef.current = readOnly
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoComplete, readOnly])

  function handleClear() {
    contextOnChange && contextOnChange()
    transition && transition(ComboboxActionType.CLEAR)
  }

  function handleValueChange(value: string) {
    transition && transition(ComboboxActionType.CHANGE, { inputValue: value })
  }

  // If they are controlling the value we still need to do our transitions, so
  // we have this derived state to emulate onChange of the input as we receive
  // new `value`s ...[*]

  // Need to determine whether the updated value come from change event on the input
  // or from a new value prop (controlled)
  const isInputting = useRef(false)
  if (
    controlledValue !== undefined &&
    contextInputValue &&
    controlledValue !== contextInputValue
  ) {
    if (isInputting.current) {
      handleValueChange(controlledValue)
    } else {
      // this is most likely the initial value so we want to
      // update the value without transitioning to suggesting
      transition &&
        transition(ComboboxActionType.CHANGE_SILENT, {
          inputValue: controlledValue,
        })
    }
  }

  // [*]... and when controlled, we don't trigger handleValueChange as the user
  // types, instead the developer controls it with the normal input onChange
  // prop
  function handleChange(value: T) {
    if (!isControlled) {
      const newValue =
        typeof value === 'string'
          ? value
          : (value as FormEvent<HTMLInputElement>).currentTarget.value
      handleValueChange(newValue)
    } else {
      isInputting.current = true
      requestAnimationFrame(() => {
        isInputting.current = false
      })
    }
  }

  function handleFocus() {
    if (selectOnClick) {
      selectOnClickRef.current = true
    }

    // If we select an option with click, useFocusManagement will focus the
    // input, in those cases we don't want to cause the menu to open back up,
    // so we guard behind these states
    if (
      openOnFocus &&
      lastActionType !== ComboboxActionType.SELECT_WITH_CLICK &&
      lastActionType !== ComboboxActionType.NAVIGATE
    ) {
      transition &&
        transition(ComboboxActionType.FOCUS, {
          persistSelection: persistSelectionRef && persistSelectionRef.current,
        })
    }
  }

  function handleClick() {
    if (selectOnClickRef.current) {
      selectOnClickRef.current = false
      inputElement && inputElement.select()
    }
  }

  function handleMouseDown() {
    if (state === ComboboxState.IDLE) {
      // Opening a closed list
      transition &&
        transition(ComboboxActionType.FOCUS, {
          persistSelection: persistSelectionRef && persistSelectionRef.current,
        })
    }
  }

  let inputOption = contextInputValue !== undefined ? contextInputValue : option

  if (
    autoComplete &&
    (state === ComboboxState.NAVIGATING || state === ComboboxState.INTERACTING)
  ) {
    // When idle, we don't have a navigationOption on ArrowUp/Down
    inputOption =
      navigationOption ||
      (controlledValue !== undefined ? controlledValue : option)
  }
  const inputValue = getComboboxText(inputOption)

  const wrappedOnClear = useWrapEvent(handleClear, onClear)
  const wrappedOnClick = useWrapEvent(handleClick, onClick)
  const wrappedOnMouseDown = useWrapEvent(handleMouseDown, onMouseDown)
  const wrappedOnBlur = useWrapEvent(handleBlur, onBlur)
  const wrappedOnFocus = useWrapEvent(handleFocus, onFocus)
  const wrappedOnOInputChange = useWrapEvent(
    handleChange as InputChangeHandler<T>,
    onInputChange as InputChangeHandler<T>
  )
  const wrappedOnKeyDown = useWrapEvent(handleKeyDown, onKeyDown)

  return [
    {
      ...props,
      'aria-activedescendant': navigationOption
        ? String(makeHash(navigationOption ? navigationOption.value : ''))
        : undefined,
      id: listboxId,
      inputValue,
      onBlur: wrappedOnBlur,
      onClear: wrappedOnClear,
      onClick: wrappedOnClick,
      onFocus: wrappedOnFocus,
      onInputChange: wrappedOnOInputChange,
      onKeyDown: wrappedOnKeyDown,
      onMouseDown: wrappedOnMouseDown,
      readOnly: readOnly,
    },
    ref,
  ]
}

export const ComboboxInputInternal = forwardRef(function ComboboxInput(
  { onChange, value, ...props }: ComboboxInputProps,
  forwardedRef: Ref<HTMLInputElement>
) {
  const [
    { inputValue, onInputChange, ...comboboxInputProps },
    ref,
  ] = useComboboxInput(
    { inputValue: value, onInputChange: onChange, ...props },
    forwardedRef
  )

  return (
    <InputSearch
      {...comboboxInputProps}
      value={inputValue}
      onChange={onInputChange}
      autoComplete="off"
      aria-autocomplete="both"
      ref={ref}
    />
  )
})

ComboboxInputInternal.displayName = 'ComboboxInputInternal'

export const ComboboxInputChipsInternal = forwardRef(function ComboboxInput(
  {
    values,
    onChange,
    onDuplicate,
    onInvalid,
    validate,
    ...props
  }: ComboboxInputChipsProps,
  forwardedRef: Ref<HTMLInputElement>
) {
  const [comboboxInputProps, ref] = useComboboxInput(props, forwardedRef)

  return (
    <InputChips
      {...comboboxInputProps}
      values={values}
      onChange={onChange}
      onDuplicate={onDuplicate}
      onInvalid={onInvalid}
      validate={validate}
      autoComplete="off"
      aria-autocomplete="both"
      ref={ref}
    />
  )
})

ComboboxInputChipsInternal.displayName = 'ComboboxInputChipsInternal'

const indicatorRaw = ReactDOMServer.renderToString(<CaretDown />)
  .replace(/1em/g, '24')
  .replace('data-reactroot=""', 'xmlns="http://www.w3.org/2000/svg"')
const indicatorSize = '1rem'
const indicatorPadding = '.25rem'
const indicatorPrefix = 'data:image/svg+xml;base64,'
export const selectIndicatorBG = (color: string) =>
  typeof window !== 'undefined' &&
  `url('${indicatorPrefix}${window.btoa(
    indicatorRaw.replace('currentColor', color)
  )}')`

const comboboxInputStyles = css<InputSearchProps>`
  background-image: ${props => {
    const color = props.disabled
      ? props.theme.colors.palette.charcoal300
      : props.theme.colors.palette.charcoal500
    return selectIndicatorBG(color)
  }};
  background-repeat: no-repeat, repeat;
  background-position: right ${indicatorPadding} center, 0 0;
  background-size: ${indicatorSize}, 100%;
  padding-right: calc(2 * ${indicatorPadding} + ${indicatorSize});

  ${InputText} {
    cursor: ${props => (props.readOnly ? 'default' : 'text')};
  }
`

export const ComboboxInput = styled(ComboboxInputInternal)`
  ${comboboxInputStyles}
`
export const ComboboxInputChips = styled(ComboboxInputChipsInternal)`
  ${comboboxInputStyles}
`

ComboboxInput.defaultProps = {
  width: '100%',
}

ComboboxInputChips.defaultProps = {
  width: '100%',
}
