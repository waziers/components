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

import React from 'react'

import { renderWithTheme } from '@looker/components-test-utils'

import { Field, FieldProps } from './Field'

function getComponentJSX(propsOverride: FieldProps = {}) {
  const defaultProps = { id: 'thumbs-up', label: '👍', name: 'thumbsUp' }
  const props = {
    ...defaultProps,
    ...propsOverride,
  }
  return (
    <Field {...props}>
      <input id={props.id} />
    </Field>
  )
}

test('A required Field', () => {
  const { getByText } = renderWithTheme(getComponentJSX({ required: true }))
  expect(getByText('*')).toBeVisible()
})

test('Field supports labelWeight', () => {
  const { container } = renderWithTheme(
    getComponentJSX({ labelFontWeight: 'normal' })
  )
  expect(container).toMatchSnapshot()
})

test('A Field with an error validation aligned to the bottom', () => {
  const { container, getByLabelText, getByText } = renderWithTheme(
    getComponentJSX({
      alignValidationMessage: 'bottom',
      validationMessage: { message: 'This is an error', type: 'error' },
    })
  )
  expect(getByLabelText('👍')).toBeVisible()
  expect(getByText('This is an error')).toBeVisible()
  expect(container).toMatchSnapshot()
})

test('A Field with an error validation aligned to the left', () => {
  const { container } = renderWithTheme(
    getComponentJSX({
      alignValidationMessage: 'left',
      validationMessage: { message: 'This is an error', type: 'error' },
    })
  )
  expect(container).toMatchSnapshot()
})

test('A Field with an error validation aligned to the right', () => {
  const { container } = renderWithTheme(
    getComponentJSX({
      alignValidationMessage: 'right',
      validationMessage: { message: 'This is an error', type: 'error' },
    })
  )
  expect(container).toMatchSnapshot()
})
