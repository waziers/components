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

import {
  CompatibleHTMLProps,
  flexbox,
  FlexboxProps,
  layout,
  LayoutProps,
  reset,
  space,
  SpaceProps,
  typography,
  TypographyProps,
} from '@looker/design-tokens'
import React, { forwardRef, useEffect, useRef, useContext, Ref } from 'react'
import styled from 'styled-components'
import { useHighlightWords, useWrapEvent } from '../../../utils'
import { Icon } from '../../../Icon'
import { makeHash } from './helpers'
import { OptionContext, SelectContext } from './SelectContext'
import { SelectActionType } from './state'

export interface SelectOptionObject {
  /**
   * Additional data associated with the option, will be passed to onSelect.
   */
  data?: any
  /**
   * The value to match against when suggesting.
   */
  value: string
}

export interface SelectOptionProps
  extends SelectOptionObject,
    FlexboxProps,
    LayoutProps,
    SpaceProps,
    TypographyProps,
    Omit<CompatibleHTMLProps<HTMLLIElement>, 'data' | 'value'> {
  /**
   * Optional. If omitted, the `value` will be used as the children like:
   * `<SelectOption value="Seattle, Tacoma, Washington" />`. But if you need
   * to control a bit more, you can put whatever children you want, but make
   * sure to render a `SelectOptionText` as well, so the value is still
   * displayed with the text highlighting on the matched portions.
   *
   * @example
   *   <SelectOption value="Apple" />
   *     🍎 <SelectOptionText />
   *   </SelectOption>
   */
  children?: React.ReactNode
}

export const SelectOptionDetail = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`

const SelectOptionInternal = forwardRef(function SelectOption(
  { children, data, value, onClick, ...props }: SelectOptionProps,
  forwardedRef: Ref<HTMLLIElement>
) {
  const {
    data: { option: contextOption, navigationOption },
    onSelect,
    transition,
    optionsRef,
  } = useContext(SelectContext)

  const valueRef = useRef<SelectOptionObject>()

  useEffect(() => {
    const option = { data, value }
    if (optionsRef) {
      // Was there an old value for this SelectOption the list?
      // If so, add the new value at the same spot
      if (valueRef.current) {
        const index = optionsRef.current.indexOf(valueRef.current)
        if (index > -1) {
          optionsRef.current[index] = option
        }
      } else {
        optionsRef.current.push(option)
      }
      valueRef.current = option
    }
  }, [value, data, optionsRef])

  const isActive = navigationOption && navigationOption.value === value
  const isCurrent = contextOption && contextOption.value === value

  function handleClick() {
    const option = { data, value }
    onSelect && onSelect(option)
    transition && transition(SelectActionType.SELECT_WITH_CLICK, { option })
  }

  const wrappedOnClick = useWrapEvent(handleClick, onClick)

  return (
    <OptionContext.Provider value={value}>
      <li
        {...props}
        ref={forwardedRef}
        id={String(makeHash(value))}
        role="option"
        aria-selected={isActive}
        // without this the menu will close from `onBlur`, but with it the
        // element can be `document.activeElement` and then our focus checks in
        // onBlur will work as intended
        tabIndex={-1}
        onClick={wrappedOnClick}
      >
        {children || <SelectOptionText />}
        {isCurrent && (
          <SelectOptionDetail>
            <Icon name="Check" />
          </SelectOptionDetail>
        )}
      </li>
    </OptionContext.Provider>
  )
})

SelectOptionInternal.displayName = 'SelectOptionInternal'

export const SelectOption = styled(SelectOptionInternal)`
  ${reset}
  ${flexbox}
  ${layout}
  ${space}
  ${typography}
  &[aria-selected='true'] {
    background-color: ${props =>
      props.theme.colors.semanticColors.primary.lighter}
  }
`

SelectOption.defaultProps = {
  display: 'flex',
  px: 'medium',
  py: 'xxsmall',
}

// SelectOptionText

// We don't forwardRef or spread props because we render multiple spans or null,
// should be fine 🤙
export function SelectOptionTextInternal(
  props: CompatibleHTMLProps<HTMLSpanElement>
) {
  const value = useContext(OptionContext) || ''
  const {
    data: { option: contextOption },
    readOnlyPropRef,
  } = useContext(SelectContext)

  const results = useHighlightWords({
    searchText: contextOption && contextOption.value,
    textToHighlight: value,
  })
  const noHighlight = readOnlyPropRef && readOnlyPropRef.current

  return (
    <>
      {results.length && !noHighlight
        ? results.map(({ start, end, highlight }, index) => {
            const str = value.slice(start, end)
            return (
              <span
                {...props}
                key={index}
                data-user-value={highlight ? true : undefined}
                data-suggested-value={highlight ? undefined : true}
              >
                {str}
              </span>
            )
          })
        : value}
    </>
  )
}

export const SelectOptionText = styled(SelectOptionTextInternal)`
  &[data-user-value='true'] {
    font-weight: bold;
  }
`
