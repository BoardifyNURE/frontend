import { createSlice } from '@reduxjs/toolkit'

export const boardsSlice = createSlice({
  name: 'boards',
  initialState: {
    boards: [],
  },
  reducers: {
    setBoards(state,action){
        state.boards = action.payload
    },
    updateBoards(state,action){
    },
    updateBoard(state,action){
    },
    removeBoard(state,action){
    }
  },
})

export const { setBoards,updateBoards,updateBoard,removeBoard} = boardsSlice.actions

export default boardsSlice.reducer
