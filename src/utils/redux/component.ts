import { createSlice, configureStore, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { ApiService1 } from '../../services/api.services1'
import { Observable } from 'rxjs'

export const fetchComponentTypes = createAsyncThunk(
  'component/fetchComponentTypes',
  async (api: ApiService1) => {
    const obs = api.getComponentNames();
    return await obs!.toPromise();
  }
);

const componentSlice = createSlice({
  name: 'component',
  initialState: {
    componentTypes: []
  },
  reducers: {
    initComponentTypes(state: any, action: PayloadAction<void>) {
      const componentTypeAlias = localStorage.getItem('componentTypeAlias')
      if (componentTypeAlias) {
        const json = JSON.parse(componentTypeAlias)
        if (typeof json === 'object') {
          state.componentTypes = json
        }
      }
     
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchComponentTypes.fulfilled, (state, action) => {
      state.componentTypes = action.payload;
      localStorage.setItem('componentTypeAlias', JSON.stringify(action.payload))
    });
  }
})

export const { initComponentTypes } = componentSlice.actions

export const componentStorage = configureStore({
  reducer: componentSlice.reducer
})



