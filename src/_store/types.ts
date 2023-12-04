import { SerializedError } from "@reduxjs/toolkit";

export interface UserRegisterPayload {
    username: string;
    password?: string;
    firstName: string;
    lastName: string;
}

export interface AlertState {
    value: {
        type: 'alert-success' | 'alert-danger';
        message: string;
        showAfterRedirect?: boolean;
    } | null;
}

export interface AlertAction {
    message: string;
    showAfterRedirect?: boolean;
}

export interface User {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    token: string;
    isDeleting?: boolean;
}

export interface AuthState {
    value?: User | null;
}

export interface UserCredential {
    username: string;
    password: string;
}

export interface DataState<T> {
    loading?: boolean,
    error?: SerializedError,
    value?: T
}

export interface UserState {
    list:  DataState<User[]> | null,
    item: DataState<User> | null,
}

export interface UserAddEditPayload {
    id: string; 
    data: UserRegisterPayload;
}
