import { Routes, Route, Navigate } from 'react-router-dom';

import { Login } from './Login';
import { Register } from './Register';
import { useAppSelector } from '../../_store';

export { AccountLayout };

function AccountLayout() {
    const auth = useAppSelector(x => x.auth.value);

    // redirect to home if already logged in
    if (auth) {
        return <Navigate to="/" />;
    }

    return (
        <div>
            <Routes>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
            </Routes>
        </div>
    );
}