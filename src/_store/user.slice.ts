import { ActionReducerMapBuilder, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { authActions } from './auth.slice';
import { fetchWrapper } from '../_helpers';
import { RootState } from './store';
import { UserAddEditPayload, UserRegisterPayload, UserState } from './types';


function createInitialState(): UserState {
    return {
        list: null,
        item: null
    }
}

const name = 'user';
const initialState = createInitialState();
const extraActions = createExtraActions();
const extraReducers = createExtraReducers();

const slice = createSlice(
    { 
        name, 
        initialState,
        reducers: {},
        extraReducers 
    }
);



// exports

export const userActions = { ...slice.actions, ...extraActions };
export const usersReducer = slice.reducer;



// implementation

function createExtraActions() {
    const baseUrl = `${import.meta.env.REACT_APP_API_URL}/users`

    return {
        register: register(),
        getAll: getAll(),
        getById: getById(),
        update: update(),
        delete: _delete()
    };

    function register() {
        return createAsyncThunk(
            `${name}/register`,
            async (user: UserRegisterPayload) => await fetchWrapper.post(`${baseUrl}/register`, user)
        );
    }

    function getAll() {
        return createAsyncThunk(
            `${name}/getAll`,
            async () => await fetchWrapper.get(baseUrl, undefined)
        );
    }

    function getById() {
        return createAsyncThunk(
            `${name}/getById`,
            async (id: string | number) => await fetchWrapper.get(`${baseUrl}/${id}`, undefined)
        );
    }

    function update() {
        return createAsyncThunk(
            `${name}/update`,
            async function ({ id, data }: UserAddEditPayload, { getState, dispatch }) {
                await fetchWrapper.put(`${baseUrl}/${id}`, data);

                // update stored user if the logged in user updated their own record
                const auth = (getState() as RootState).auth.value;
                if (id === auth?.id.toString()) {
                    // update local storage
                    const user = { ...auth, ...data };
                    localStorage.setItem('auth', JSON.stringify(user));

                    // update auth user in redux state
                    dispatch(authActions.setAuth(user));
                }
            }
        );
    }

    // prefixed with underscore because delete is a reserved word in javascript
    function _delete() {
        return createAsyncThunk(
            `${name}/delete`,
            async function (id: number, { getState, dispatch }) {
                await fetchWrapper.delete(`${baseUrl}/${id}`, undefined);

                // auto logout if the logged in user deleted their own record
                if (id === (getState() as RootState).auth.value?.id) {
                    dispatch(authActions.logout());
                }
            }
        );
    }
}

function createExtraReducers() {
    return (builder: ActionReducerMapBuilder<UserState>) => {
        getAll();
        getById();
        _delete();

        function getAll() {
            const { pending, fulfilled, rejected } = extraActions.getAll;
            builder
                .addCase(pending, (state) => {
                    state.list = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    state.list = { value: action.payload };
                })
                .addCase(rejected, (state, action) => {
                    state.list = { error: action.error };
                });
        }

        function getById() {
            const { pending, fulfilled, rejected } = extraActions.getById;
            builder
                .addCase(pending, (state) => {
                    state.item = { loading: true };
                })
                .addCase(fulfilled, (state, action) => {
                    state.item = { value: action.payload };
                })
                .addCase(rejected, (state, action) => {
                    state.item = { error: action.error };
                });
        }

        function _delete() {
            const { pending, fulfilled, rejected } = extraActions.delete;
            builder
                .addCase(pending, (state, action) => {
                    const user = state.list?.value?.find(x => x.id === action.meta.arg);
                    if (user) user.isDeleting = true;
                })
                .addCase(fulfilled, (state, action) => {
                    const users = state.list?.value?.filter(x => x.id !== action.meta.arg);
                    if (users && state.list) state.list.value = users
                })
                .addCase(rejected, (state, action) => {
                    const user = state.list?.value?.find(x => x.id === action.meta.arg);
                    if (user) user.isDeleting = false;
                });
        }
    }
}