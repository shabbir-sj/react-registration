import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AlertAction, AlertState } from './types';


function createInitialState(): AlertState {
    return {
        value: null
    }
}

// create slice
const initialState = createInitialState();
const slice = createSlice(
    { 
        name: 'alert', 
        initialState, 
        reducers: {

            // payload can be a string message ('alert message') or 
            // an object ({ message: 'alert message', showAfterRedirect: true })
            success: (state, action: PayloadAction<AlertAction>) => {
                state.value = {
                    type: 'alert-success',
                    message: action.payload?.message,
                    showAfterRedirect: action.payload?.showAfterRedirect
                };
            },
        
            error: (state, action: PayloadAction<AlertAction>) => {
                state.value = {
                    type: 'alert-danger',
                    message: action.payload?.message,
                    showAfterRedirect: action.payload?.showAfterRedirect
                };
            },
        
            clear: (state) => {
                // if showAfterRedirect flag is true the alert is not cleared 
                // for one route change (e.g. after successful registration)
                if (state.value?.showAfterRedirect) {
                    state.value.showAfterRedirect = false;
                } else {
                    state.value = null;
                }
            }
        }
    }
);

// exports
export const alertActions = { ...slice.actions };
export const alertReducer = slice.reducer;


