import { NavLink, useNavigate } from 'react-router-dom';

import { authActions, useAppDispatch, useAppSelector } from '../_store';

export { Nav };

function Nav() {
    const auth = useAppSelector(x => x.auth.value);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    async function logout() {
        await dispatch(authActions.logout()).unwrap;
        navigate('/account/login');
    }

    // only show nav when logged in
    if (!auth) return null;
    
    return (
        <nav className="navbar navbar-expand navbar-dark bg-dark px-3">
            <div className="navbar-nav w-100 d-flex justify-content-between">
                <div className="d-flex">
                    <NavLink to="/" className="nav-item nav-link">Home</NavLink>
                    <NavLink to="/users" className="nav-item nav-link">Users</NavLink>
                </div>
                <button onClick={logout} className="btn btn-link nav-item nav-link">Logout</button>
            </div>
        </nav>
    );
}