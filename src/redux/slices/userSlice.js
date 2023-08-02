import {createSlice} from '@reduxjs/toolkit';

const userSlicer = createSlice({
  name: 'user',
  initialState: {
    welcome: true,
    employeeData: null,
    token: null,
    type: null,
    access_token: null,
    isLogin: false,
    selectedTab: 'Invited',
  },

  reducers: {
    setEmployee: (state, action) => {
      state.employeeData = action.payload;
    },

    setToken: (state, action) => {
      state.token = action.payload;
    },

    setToken: (state, action) => {
      state.token = action.payload;
    },
    setAccessToken: (state, action) => {
      state.access_token = action.payload;
    },

    logOut: (state, action) => {
      state.isLogin = action.payload;
    },
    onLogin: (state, action) => {
      state.isLogin = action.payload;
    },
    updateEmployee: (state, action) => {
      state.employeeData.toggle = action.payload.toggle;
    },
    setWelcome: (state, action) => {
      state.welcome = action.payload;
    },
    setSelectedTab: (state, action) => {
      state.selectedTab = action.payload;
    },
  },
});

export const {
  setEmployee,
  setToken,
  logOut,
  onLogin,
  setAccessToken,
  updateEmployee,
  setWelcome,
  setSelectedTab,
} = userSlicer.actions;

export default userSlicer.reducer;
