import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/auth'
import boards from './slices/boards'

export const store = configureStore({
  reducer: {
    auth:authSlice,
    boards
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
