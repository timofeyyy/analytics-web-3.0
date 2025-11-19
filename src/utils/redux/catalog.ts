// const initialState: Map<string, any> = new Map()

// const reducer = (action: string, payload: any): Map<string, any> | undefined => {
//     initialState.set(action, payload)
//     return storage
// }

// export default reducer

import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit'
import { ComponentTypes } from '../types/app'

const ctalogSlice = createSlice({
  name: 'catalog',
  initialState: {
    columns: {},
    currentValues: JSON.parse(localStorage.getItem('savedFilterValues')!) ?? {},
    alias: {},
    // componentTypealias: []
  },
  reducers: {
    setColumns: (state: any, action: PayloadAction<[string, string[]]>) => {
      state.columns[action.payload[0]] = action.payload[1]
    },
    setCurrentValue: (state: any, action: PayloadAction<[string, string, string]>) => {
      if (!state.currentValues[action.payload[0]]) {
        state.currentValues[action.payload[0]] = {}
      }
      state.currentValues[action.payload[0]][action.payload[1]] = action.payload[2]
    },
    removeCurrentValue: (state: any, action: PayloadAction<[string, string]>) => {
      if (state.currentValues[action.payload[0]] && state.currentValues[action.payload[0]][action.payload[1]]) {
        delete state.currentValues[action.payload[0]][action.payload[1]]
      }
    },
    removeRuComponentType: (state: any, action: PayloadAction<[string]>) => {
      if (state.currentValues[action.payload[0]]) {
        delete state.currentValues[action.payload[0]]
      }
    },
    setalias: (state: any, action: PayloadAction<any>) => {
      state.alias = action.payload
    },
    // setComponentTypealias: (state: any, action: PayloadAction<ComponentTypes[]>) => {
    //   state.componentTypealias = action.payload
    // },
  }
})

export const { setColumns, setCurrentValue, setalias, removeCurrentValue, removeRuComponentType } = ctalogSlice.actions

export const catalogStorage = configureStore({
  reducer: ctalogSlice.reducer
})



