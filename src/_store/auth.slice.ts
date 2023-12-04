import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { fetchWrapper } from '../_helpers';
import { AuthState, User, UserCredential } from './types';


// create slice

const name = 'auth';
const initialState = createInitialState();
const extraActions = createExtraActions();
const slice = createSlice(
    { 
        name, 
        initialState,
        reducers: {
            setAuth: (state, action: PayloadAction<User | null>) => {
                state.value = action.payload;
            }
        }
    }
);

// exports

export const authActions = { ...slice.actions, ...extraActions };
export const authReducer = slice.reducer;

// implementation

function createInitialState(): AuthState {
    return {
        // initialize state from local storage to enable user to stay logged in
        value: JSON.parse(localStorage.getItem('auth')!)
    }
}

function createExtraActions() {
    const baseUrl = `${import.meta.env.REACT_APP_API_URL}/users`;

    return {
        login: login(),
        logout: logout()
    };

    function login() {
        return createAsyncThunk(
            `${name}/login`,
            async function ({ username, password }: UserCredential, { dispatch }) {
                const user = await fetchWrapper.post(`${baseUrl}/authenticate`, { username, password });

                // set auth user in redux state
                dispatch(authActions.setAuth(user));

                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('auth', JSON.stringify(user));
            }
        );
    }

    function logout() {
        return createAsyncThunk(
            `${name}/logout`,
            function (_, { dispatch }) {
                dispatch(authActions.setAuth(null));
                localStorage.removeItem('auth');
            }
        );
    }
}