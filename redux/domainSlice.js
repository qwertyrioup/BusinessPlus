import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: null,
}

export const domainSlice = createSlice({
  name: 'domain',
  initialState,
  reducers: {

    saveDomain: (state, action) => {
      state.value = action.payload
    },
    deleteDomain: (state) => {
      state.value = null;
     
    },
  },
})

export const { saveDomain , deleteDomain} = domainSlice.actions

export default domainSlice.reducer