import { Routes, Route, Navigate } from 'react-router-dom';

import { Nav, Alert, PrivateRoute } from './_components';
import { Home } from './features/home';
import { AccountLayout } from './features/account';
import { UsersLayout } from './features/users';


export { App };

function App() {
    return (
        <div className="app-container bg-light">
            <Nav />
            <Alert />
            <div className="container pt-5 pb-4">
                <Routes>
                    {/* private */}
                    <Route element={<PrivateRoute />}>
                        <Route path="/" element={<Home />} />
                        <Route path="users/*" element={<UsersLayout />} />
                    </Route>
                    {/* public */}
                    <Route path="account/*" element={<AccountLayout />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </div>
    );
}
