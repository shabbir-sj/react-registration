import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAppSelector } from '../_store';

export { PrivateRoute };

function PrivateRoute() {
    const auth = useAppSelector(x => x.auth.value);
    const location = useLocation();

    if (!auth) {
        // not logged in so redirect to login page with the return url
        return <Navigate to="/account/login" state={{ from: location }} />
    }

    // authorized so return outlet for child routes
    return <Outlet />;
}