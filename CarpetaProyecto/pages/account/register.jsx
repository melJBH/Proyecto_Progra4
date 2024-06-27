import { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { Layout } from 'components/register';
import { userService_2, loginService, alertService } from 'services';

export default Register;

function Register() {
    const router = useRouter();

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
            .required('Password is required')
            .min(6, 'Password must be at least 6 characters')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // Obtiene funciones para construir el formulario con useForm() hook
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;

    async function onSubmit(data) {
        // Transforma el valor de state
        if (data.state === 'active') {
            data.state = 'A';
        } else if (data.state === 'inactive') {
            data.state = 'I';
        }

        // Separa los datos del usuario y del login
        const user = {
            identification: data.identification,
            name: data.name,
            first_lastName: data.firstLastName,
            second_lastName: data.secondLastName
        };

        try {
            await userService_2.register(user);

            const login = {
                id_user: data.identification,
                password: data.password,
                state: data.state
            };

            await loginService.register(login);

            alertService.success('Registration successful', true);
            router.push('/account/login');
        } catch (error) {
            alertService.error(error.message || error.toString());
        }
    }

    return (
        <Layout>
            <div className="card">
                <h4 className="card-header">Register</h4>
                <div className="card-body">
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
                            <label className="form-label">Password</label>
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
                        <button disabled={formState.isSubmitting} className="btn btn-primary">
                            {formState.isSubmitting && <span className="spinner-border spinner-border-sm me-1"></span>}
                            Register
                        </button>
                        <Link href="/account/login" className="btn btn-link">Cancel</Link>
                    </form>
                </div>
            </div>
        </Layout>
    );
}