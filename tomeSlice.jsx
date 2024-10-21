//par défaut c'est un tableau vide
import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    tomes: []
   
}

export const tomeSlice = createSlice({
    name: "tomes",
    initialState,
    reducers: {
        loadTomes: (state, action) => {
            state.tomes = action.payload
        },
        deleteTomes: (state, action) => {
            state.tomes = action.payload
        }
    }
})

export const {loadTomes, deleteTomes} = tomeSlice.actions
export const selectTomes = (state) => state.tomes
export default tomeSlice.reducer
