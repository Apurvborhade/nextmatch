import { createSlice } from "@reduxjs/toolkit";

type User = {
    name:string,
    email:string,
    sub:string,
    id:string,
    role:string,
    createdAt:string,
    updatedAt:string,
    iat:number,
    exp:number,
    jti:string
}

interface UserState {
    user:User | null
}
const initialState:UserState = {
    user:null
}
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        storeUser(state, action) {
            state.user = action.payload
        }
    }
})

export const { storeUser } = userSlice.actions

export default userSlice.reducer
