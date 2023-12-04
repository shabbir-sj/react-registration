import { Link, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { useAppDispatch, userActions, alertActions, UserRegisterPayload } from '../../_store';

export { Register };

function Register() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // form validation rules 
    const validationSchema = Yup.object().shape({
        firstName: Yup.string().required('First Name is required'),
        lastName: Yup.string().required('Last Name is required'),
        username: Yup.string().required('Username is required'),
        password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors, isSubmitting } = formState;

    async function onSubmit(data: UserRegisterPayload) {
        dispatch(alertActions.clear());
        try {
            await dispatch(userActions.register(data));

            // redirect to login page and display success alert
            navigate('/account/login');
            dispatch(alertActions.success({ message: 'Registration successful', showAfterRedirect: true }));
        } catch (error) {
            dispatch(alertActions.error(error as {message: string}));
        }
    }

    return (
        <div className="page-content">
            <form className='app-form card' onSubmit={handleSubmit(onSubmit)}>
                <h3 className="form-header">Register</h3>
                <div className="form-control-group">
                    <label className="form-label">First Name</label>
                    <input type="text" {...register('firstName')} className={`form-control ${errors.firstName ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.firstName?.message}</div>
                </div>
                <div className="form-control-group">
                    <label className="form-label">Last Name</label>
                    <input type="text" {...register('lastName')} className={`form-control ${errors.lastName ? 'is-invalid' : ''}`} />
                    <div className="invalid-feedback">{errors.lastName?.message}</div>
                </div>
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
                    Register
                </button>
                <Link to="../login" className="btn btn-link">Login</Link>
            </form>
        </div>
    )
}
