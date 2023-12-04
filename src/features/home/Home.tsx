import { Link } from 'react-router-dom';
import { useAppSelector } from '../../_store';


export { Home };

function Home() {
    const auth = useAppSelector(x => x.auth.value);
    return (
        <div>
            <h1>Hi {auth?.firstName}!</h1>
            <p>You're logged in!!</p>
            <p><Link to="/users">Manage Users</Link></p>
        </div>
    );
}