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

import { fireEvent } from '@testing-library/react'
import { renderWithTheme } from '@looker/components-test-utils'

import { FieldSelect } from './FieldSelect'

test('A FieldSelect', () => {
  const { getByLabelText, getByText, queryByRole } = renderWithTheme(
    <FieldSelect label="👍" name="thumbsUp" id="thumbs-up" />
  )
  expect(getByLabelText('👍')).toBeVisible()
  expect(getByText('👍')).toBeVisible()
  expect(queryByRole('listbox')).not.toBeInTheDocument()
})

test('Should accept a value', () => {
  const { getByLabelText } = renderWithTheme(
    <FieldSelect
      label="👍"
      name="thumbsUp"
      id="thumbs-up"
      value="foobar"
      options={[{ label: 'Foobar', value: 'foobar' }]}
    />
  )

  const input = getByLabelText('👍')
  expect(input).toHaveValue('Foobar')
})

test('Should trigger onChange handler', () => {
  const handleChange = jest.fn()

  const { getByLabelText, getByText } = renderWithTheme(
    <FieldSelect
      label="👍"
      name="thumbsUp"
      id="thumbs-up"
      value="foobar"
      onChange={handleChange}
      options={[{ label: 'Foobar', value: 'foobar' }]}
    />
  )

  fireEvent.mouseDown(getByLabelText('👍'))
  fireEvent.click(getByText('Foobar'))
  expect(handleChange).toHaveBeenCalledTimes(1)
})
