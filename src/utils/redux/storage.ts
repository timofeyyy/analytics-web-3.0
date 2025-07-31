// const initialState: Map<string, any> = new Map()

// const reducer = (action: string, payload: any): Map<string, any> | undefined => {
//     initialState.set(action, payload)
//     return storage
// }

// export default reducer

import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit'

const componentSlice = createSlice({
  name: 'component',
  initialState: {
    columns: {},
    currentValues: {},
    allias: {}
  },
  reducers: {
    setColumns: (state: any, action: PayloadAction<[string, string[]]>) => {
      state.columns[action.payload[0]] = action.payload[1]
    },
    setCurrentValue: (state: any, action: PayloadAction<[string, string]>) => {
      state.currentValues[action.payload[0]] = action.payload[1]
    },
    // deleteValue: (state: any, action: PayloadAction<[string, string]>) => {
    //   // state.currentValues[action.payload[0]] = action.payload[1]
    // }

  }
})

export const { setColumns, setCurrentValue } = componentSlice.actions

export const store = configureStore({
  reducer: componentSlice.reducer
})



