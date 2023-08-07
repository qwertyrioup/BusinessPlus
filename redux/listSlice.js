import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: null,
}

export const listSlice = createSlice({
  name: 'list',
  initialState,
  reducers: {

    saveList: (state, action) => {
      state.value = action.payload
    },
    deleteList: (state) => {
      state.value = null;
     
    },
  },
})

export const { saveList , deleteList} = listSlice.actions

export default listSlice.reducer