import { createSlice, configureStore, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { ApiService } from '../../services/api.services1'
import { Observable } from 'rxjs'
import { isException } from '../static-data/filter-exceptions';

// export const fetchComponentTypes = createAsyncThunk(
//   'component/fetchComponentTypes',
//   async (api: ApiService) => {
//     const obs = api.getComponentNames();
//     return await obs!.toPromise();
//   }
// );

const componentSlice = createSlice({
  name: 'component',
  initialState: {
    componentTypes: [],
    columns: {},
    currentValues: {},
    alias: {},
    componentSchema: {}
  },
  reducers: {
    initComponentTypes(state: any, action: PayloadAction<any[]>) {
      // const componentTypeAlias = JSON.parse(localStorage.getItem('componentTypeAlias')!)
      // if (componentTypeAlias) {
      //   if (typeof componentTypeAlias === 'object') {
      //     state.componentTypes = componentTypeAlias
      //   }
      // }
      state.componentTypes = action.payload
    },
    setColumns: (state: any, action: PayloadAction<[string, string[]]>) => {
      state.columns[action.payload[0]] = action.payload[1]
    },
    setCurrentValue: (state: any, action: PayloadAction<[string, string]>) => {
      state.currentValues[action.payload[0]] = action.payload[1]
    },
    setAlias: (state: any, action: PayloadAction<any>) => {
      state.alias = action.payload
    },
    setComponentSchema: (state: any, action: PayloadAction<any>) => {
      const schema: any = {}
      const obj = action.payload
      for (const type in obj) {
        const example: any = obj[type][0]
        schema[example.ruComponentType] = []
        for (const key in example) {
          if (!isException(key)) {
            (schema[example.ruComponentType] as string[]).push(key)
          }
        }
      }
      state.componentSchema = schema
    }
  },
  // extraReducers: (builder) => {
  //   builder.addCase(fetchComponentTypes.fulfilled, (state, action) => {
  //     state.componentTypes = action.payload;
  //     localStorage.setItem('componentTypeAlias', JSON.stringify(action.payload))
  //   });
  // }
})

export const { setColumns, setCurrentValue, setAlias, setComponentSchema, initComponentTypes } = componentSlice.actions

export const componentStorage = configureStore({
  reducer: componentSlice.reducer
})



