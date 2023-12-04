import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { userActions, alertActions, useAppSelector, useAppDispatch, UserRegisterPayload } from '../../_store';

export { AddEdit };

function AddEdit() {
    const { id } = useParams();
    const [title, setTitle] = useState('');

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const user = useAppSelector(x => x.users?.item);

    // form validation rules 
    const validationSchema = Yup.object().shape({
        firstName: Yup.string()
            .required('First Name is required'),
        lastName: Yup.string()
            .required('Last Name is required'),
        username: Yup.string()
            .required('Username is required'),
        password: (function() {
            const schema = Yup.string()
                .transform(x => x === '' ? undefined : x)
                .min(6, 'Password must be at least 6 characters');
            // password optional in edit mode
            return !id ? schema.required('Password is required') : schema;
        })()
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors, isSubmitting } = formState;

    useEffect(() => {
        if (id) {
            setTitle('Edit User');
            // fetch user details into redux state and 
            // populate form fields with reset()
            dispatch(userActions.getById(id)).unwrap()
                .then(user => reset(user));
        } else {
            setTitle('Add User');
        }
    }, []);

    async function onSubmit(data: UserRegisterPayload) {
        dispatch(alertActions.clear());
        try {
            // create or update user based on id param
            let message;
            if (id) {
                await dispatch(userActions.update({ id, data })).unwrap();
                message = 'User updated';
            } else {
                await dispatch(userActions.register(data)).unwrap();
                message = 'User added';
            }

            // redirect to user list with success message
            navigate('/users');
            dispatch(alertActions.success({ message, showAfterRedirect: true }));
        } catch (error) {
            dispatch(alertActions.error(error as {message: string}));
        }
    }

    return (
        <div className="page-content">
            {!(user?.loading || user?.error) &&                            
                <form className='app-form card' onSubmit={handleSubmit(onSubmit)}>
                    <h3 className="form-header">{title}</h3>
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
                        <label className="form-label">
                            Password
                            {id && <em className="ml-1">(Leave blank to keep the same password)</em>}
                        </label>
                        <input type="password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                        <div className="invalid-feedback">{errors.password?.message}</div>
                    </div>
                    <button type="submit" disabled={isSubmitting} className="btn btn-primary me-2 form-button">
                        {isSubmitting && <span className="spinner-border spinner-border-sm"></span>}
                        Save
                    </button>
                    <button onClick={() => reset()} type="button" disabled={isSubmitting} className="btn btn-secondary form-button">Reset</button>
                    <Link to="/users" className="btn btn-link">Cancel</Link>
                </form>
            }
            {user?.loading &&
                <div className="text-center m-5">
                    <span className="spinner-border spinner-border-lg align-center"></span>
                </div>
            }
            {user?.error &&
                <div className="text-center m-5">
                    <div className="text-danger">Error loading user: {user.error.message}</div>
                </div>
            }
        </div>
    );
}
