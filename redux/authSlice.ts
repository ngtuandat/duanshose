import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        register: {
            error: null,
            success: false,
        },
        login: {
            user: null,
            error: null,
        },
    },
    reducers: {
        registerSuccess: (state) => {
            state.register.error = null;
            state.register.success = true;
        },
        registerFailed: (state, action) => {
            state.register.error = action.payload;
            state.register.success = false;
        },
        loginSuccess: (state, action) => {
            state.login.user = action.payload;
            state.login.error = null;
        },
        loginFailed: (state, action) => {
            state.login.error = action.payload;
        }
    },
});

export const {
    registerSuccess,
    registerFailed,
    loginSuccess,
    loginFailed,
} = authSlice.actions;

export default authSlice.reducer;
