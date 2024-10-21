import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  comments: [], 
}

export const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    addComment: (state, action) => {
      state.comments.push(action.payload)
    },
    modifyComment: (state, action) => {
      const { id, content } = action.payload
      const comment = state.comments.find((c) => c.id === id)
      if (comment) {
        comment.content = content
      }
    },
    deleteComment: (state, action) => {
      state.comments = state.comments.filter(
        (comment) => comment.id !== action.payload
      )
    },
  },
})

// Exporter les actions générées
export const { addComment, modifyComment, deleteComment } = commentSlice.actions

// Exporter le reducer comme export par défaut
export default commentSlice.reducer
