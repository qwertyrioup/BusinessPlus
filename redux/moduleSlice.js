import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: null,
}

export const moduleSlice = createSlice({
  name: 'module',
  initialState,
  reducers: {

    saveModule: (state, action) => {
      state.value = action.payload
    },
    deleteModule: (state) => {
      state.value = null;
     
    },
  },
})

export const { saveModule , deleteModule} = moduleSlice.actions

export default moduleSlice.reducer