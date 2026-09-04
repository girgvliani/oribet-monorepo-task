import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IBlog } from '../../types/common.type'

interface BlogsState {
  blogItems: IBlog[]
}

const initialState: BlogsState = {
  blogItems: [],
}

const blogsSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    changeBlog(state, action: PayloadAction<IBlog[]>) {
      state.blogItems = action.payload
    },
  },
})

export const { changeBlog } = blogsSlice.actions
export default blogsSlice.reducer
