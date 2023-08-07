import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: 'English',
}

export const languageSlice = createSlice({
  name: 'Language',
  initialState,
  reducers: {

    saveLang: (state, action) => {
      state.value = action.payload
    },
 
  
  },
})

export const { saveLang } = languageSlice.actions

export default languageSlice.reducer