import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import { alertReducer } from './alert.slice';
import { authReducer } from './auth.slice';
import { usersReducer } from './user.slice';


export const store = configureStore({
    reducer: {
        alert: alertReducer,
        auth: authReducer,
        users: usersReducer
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
