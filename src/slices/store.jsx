import {configureStore} from "@reduxjs/toolkit"
import userReducer from "./userSlice"
import tomeReducer from "./tomeSlice"
import commentReducer from "./commentSlice"

const store = configureStore({
    reducer: {
        user: userReducer,
        tomes: tomeReducer,
        comment: commentReducer,
    }
})

export default store