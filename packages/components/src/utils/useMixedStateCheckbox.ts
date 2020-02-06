import { useReducer } from 'react'
import some from 'lodash/some'
import every from 'lodash/every'

export type MixedBoolean = true | false | 'mixed'

interface CheckboxTreeAction {
  type: 'TOGGLE_CHILD' | 'TOGGLE_PARENT'
  payload?: number
}

export interface CheckboxTreeState {
  parent: MixedBoolean
  children: boolean[]
}

function reducer(
  state: CheckboxTreeState,
  { type, payload }: CheckboxTreeAction
) {
  switch (type) {
    case 'TOGGLE_CHILD':
      if (typeof payload === 'number') {
        const newChildValue = !state.children[payload]
        const children = [
          ...state.children.slice(0, payload),
          newChildValue,
          ...state.children.slice(payload + 1),
        ]
        const parent: MixedBoolean = every(children)
          ? true
          : some(children)
          ? 'mixed'
          : false

        return { children, parent }
      }
      return state
    case 'TOGGLE_PARENT': {
      const newValue = !state.parent
      return {
        children: state.children.map(() => newValue),
        parent: newValue,
      }
    }
  }
}

export function useMixedStateCheckbox(initialState: CheckboxTreeState) {
  const [state, dispatch] = useReducer(reducer, initialState)

  return {
    children: initialState.children.map((_: boolean, index: number) => ({
      checked: state.children[index],
      onChange: () =>
        dispatch({
          payload: index,
          type: 'TOGGLE_CHILD',
        }),
    })),
    parent: {
      checked: state.parent,
      onChange: () => dispatch({ type: 'TOGGLE_PARENT' }),
    },
  }
}
