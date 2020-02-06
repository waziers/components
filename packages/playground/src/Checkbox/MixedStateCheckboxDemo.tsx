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
import {
  Checkbox,
  Label,
  List,
  ListItem,
  useMixedStateCheckbox,
} from '@looker/components'

/* eslint-disable sort-keys */
export const MixedStateCheckboxDemo = () => {
  const { parent, children } = useMixedStateCheckbox({
    parent: false,
    children: [false, false, false],
  })

  return (
    <>
      <List p="large">
        <ListItem>
          <Checkbox
            id="fruit-parent"
            name="fruit"
            value="all-fruit"
            {...parent}
          />
          <Label htmlFor="fruit-parent" fontSize="medium">
            Fruit
          </Label>
        </ListItem>
        <ListItem>
          <List pl="large">
            <ListItem>
              <Checkbox
                id="fruit-apple"
                name="fruit"
                value="apple"
                {...children[0]}
              />
              <Label htmlFor="fruit-apple" fontSize="large">
                🍏
              </Label>
            </ListItem>
            <ListItem>
              <Checkbox
                id="fruit-banana"
                name="fruit"
                value="apple"
                {...children[1]}
              />
              <Label htmlFor="fruit-banana" fontSize="large">
                🍌
              </Label>
            </ListItem>
            <ListItem>
              <Checkbox
                id="fruit-avocado"
                name="fruit"
                value="apple"
                {...children[2]}
              />
              <Label htmlFor="fruit-avocado" fontSize="large">
                🥑
              </Label>
            </ListItem>
          </List>
        </ListItem>
      </List>
    </>
  )
}
