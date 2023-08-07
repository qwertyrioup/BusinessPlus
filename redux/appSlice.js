import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  app_info: {},
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {

    saveApp: (state, action) => {
      state.app_info = action.payload
    },
    deleteApp: (state) => {
      state.app_info = null;
     
    },
  },
})

export const { saveApp , deleteApp} = appSlice.actions

export default appSlice.reducer