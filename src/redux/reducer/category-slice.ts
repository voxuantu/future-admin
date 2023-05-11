import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../store/root'
import { createCategory, getCategories } from '../action/category-actions'

interface CategoryState {
  categories: ICategory[]
}

const initialState: CategoryState = {
  categories: []
}

export const counterSlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getCategories.fulfilled, (state, action: PayloadAction<ICategory[]>) => {
      state.categories = action.payload
    })
    builder.addCase(createCategory.fulfilled, (state, action: PayloadAction<ICategory>) => {
      const index = state.categories.findIndex(item => item._id === action.payload._id)

      if (index === -1) {
        state.categories.push(action.payload)
      }
    })
  }
})

export const selectCategories = (state: RootState) => state.categories.categories

export default counterSlice.reducer
