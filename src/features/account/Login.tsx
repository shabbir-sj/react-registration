import { Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { useAppDispatch, UserCredential, authActions, alertActions } from '../../_store';

export { Login };

function Login() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // form validation rules 
    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        password: Yup.string().required('Password is required')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors, isSubmitting } = formState;


    async function onSubmit({ username, password }: UserCredential) {
        dispatch(alertActions.clear());
        try {
            await dispatch(authActions.login({ username, password })).unwrap();

            // redirect to home
            navigate('/');
        } catch (error) {
            dispatch(alertActions.error(error as {message: string}));
        }

    }

    return (
        <div className="page-content">
            <form className='app-form card' onSubmit={handleSubmit(onSubmit)}>
                    <h3 className="form-header">Login</h3>
                    <div className="form-control-group">
                        <label className="form-label">Username</label>
                        <input type="text" {...register('username')} className={`form-control ${errors.username ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.username?.message}</div>
                    </div>
                    <div className="form-control-group">
                        <label className="form-label">Password</label>
                        <input type="password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.password?.message}</div>
                    </div>
                    <button disabled={isSubmitting} className="btn btn-primary form-button">
                        {isSubmitting && <span className="spinner-border spinner-border-sm me-1"></span>}
                        Login
                    </button>
                    <Link to="../register" className="btn btn-link">Register</Link>
                </form>
        </div>
    )
}
