import { createSlice } from '@reduxjs/toolkit'

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuth: false,
    user: {}
  },
  reducers: {
    setUser(state,action){
        state.isAuth = action.payload.isAuth
        state.user = action.payload.user
    },
    removeUser(state,action){
        state.isAuth = false
        state.user = {}
    }
  },
})

export const { setUser ,removeUser} = authSlice.actions

export default authSlice.reducer
