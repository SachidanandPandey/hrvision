// src/features/menu/menuSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeMenu: 'Home',
  activeSubMenu: '',
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setActiveMenu: (state, action) => {
      state.activeMenu = action.payload.menu;
      state.activeSubMenu = action.payload.subMenu || '';
    },
  },
});

export const { setActiveMenu } = menuSlice.actions;
export default menuSlice.reducer;