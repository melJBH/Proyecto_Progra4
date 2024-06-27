import { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { userService_2, loginService, alertService } from 'services';

export { AddEdit };

function AddEdit(props) {
    const user = props?.user;
    const router = useRouter();

    // form validation rules 
    const validationSchema = Yup.object().shape({
        identification: Yup.string()
            .required('Identification is required'),
        name: Yup.string()
            .required('Name is required'),
        firstLastName: Yup.string()
            .required('First Last Name is required'),
        secondLastName: Yup.string()
            .required('Second Last Name is required'),
        state: Yup.string()
            .required('State is required'),
        password: Yup.string()
            .transform(x => x === '' ? undefined : x)
            // password optional in edit mode
            .concat(user ? null : Yup.string().required('Password is required'))
            .min(6, 'Password must be at least 6 characters')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // set default form values if in edit mode
    if (user) {
        formOptions.defaultValues = props.user;
    }

    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors } = formState;

    async function onSubmit(data) {
        alertService.clear();
        
        // Transforma el valor de state
        if (data.state === 'active') {
            data.state = 'A';
        } else if (data.state === 'inactive') {
            data.state = 'I';
        }

        const userData = {
            identification: data.identification,
            name: data.name,
            first_lastName: data.firstLastName,
            second_lastName: data.secondLastName
        };

        try {
            // create or update user based on user prop
            let message;
            if (user) {
                await userService_2.update(user.id, userData);
                message = 'User updated';
            } else {
                await userService_2.register(userData);

                const loginData = {
                    id_user: data.identification,
                    password: data.password,
                    state: data.state
                };

                await loginService.register(loginData);
                message = 'User added';
            }

            // redirect to user list with success message
            router.push('/users');
            alertService.success(message, true);
        } catch (error) {
            alertService.error(error);
            console.error(error);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
                <label className="form-label">Identification</label>
                <input name="identification" type="text" {...register('identification')} className={`form-control ${errors.identification ? 'is-invalid' : ''}`} />
                <div className="invalid-feedback">{errors.identification?.message}</div>
            </div>
            <div className="mb-3">
                <label className="form-label">Name</label>
                <input name="name" type="text" {...register('name')} className={`form-control ${errors.name ? 'is-invalid' : ''}`} />
                <div className="invalid-feedback">{errors.name?.message}</div>
            </div>
            <div className="mb-3">
                <label className="form-label">First Last Name</label>
                <input name="firstLastName" type="text" {...register('firstLastName')} className={`form-control ${errors.firstLastName ? 'is-invalid' : ''}`} />
                <div className="invalid-feedback">{errors.firstLastName?.message}</div>
            </div>
            <div className="mb-3">
                <label className="form-label">Second Last Name</label>
                <input name="secondLastName" type="text" {...register('secondLastName')} className={`form-control ${errors.secondLastName ? 'is-invalid' : ''}`} />
                <div className="invalid-feedback">{errors.secondLastName?.message}</div>
            </div>
            <div className="mb-3">
                <label className="form-label">
                    Password
                    {user && <em className="ms-1">(Leave blank to keep the same password)</em>}
                </label>
                <input name="password" type="password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                <div className="invalid-feedback">{errors.password?.message}</div>
            </div>
            <div className="form-check d-flex align-items-center">
                <input className="form-check-input me-2" type="radio" name="state" id="active" value="active" {...register('state')} />
                <label className="form-check-label me-4" htmlFor="active">
                    Active
                </label>
                <input className="form-check-input me-2 ms-4" type="radio" name="state" id="inactive" value="inactive" {...register('state')} />
                <label className="form-check-label" htmlFor="inactive">
                    Inactive
                </label>
            </div>
            <div className="mb-3">
                <button type="submit" disabled={formState.isSubmitting} className="btn btn-primary me-2">
                    {formState.isSubmitting && <span className="spinner-border spinner-border-sm me-1"></span>}
                    Save
                </button>
                <button onClick={() => reset(formOptions.defaultValues)} type="button" disabled={formState.isSubmitting} className="btn btn-secondary">Reset</button>
                <Link href="/users" className="btn btn-link">Cancel</Link>
            </div>
        </form>
    );
}
