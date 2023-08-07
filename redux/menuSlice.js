import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  List: [],
}

export const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {

    saveMenu: (state, action) => {
      state.List = action.payload
    },
    deleteMenu: (state) => {
      state.List = null;
     
    },
  },
})

export const { saveMenu , deleteMenu} = menuSlice.actions

export default menuSlice.reducer