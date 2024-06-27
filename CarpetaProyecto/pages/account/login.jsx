import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import userIcon from '../Images/Usuario1.png';
import passwordIcon from '../Images/candado1.png';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { Layout } from 'components/account';
import { loginService, alertService } from 'services';

export default function Login() {
    const router = useRouter();

    // form validation rules
    const validationSchema = Yup.object().shape({
        identification: Yup.string().required('Identification is required'),
        password: Yup.string().required('Password is required')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit({ identification, password }) {
        alertService.clear();
        console.log("Attempting login with", identification, password);
    
        return loginService.login(identification, password)
            .then((login) => {
                console.log("Login successful", login);
                router.push('/forms/catalogue');
            })
            .catch((error) => {
                console.error("Login failed", error);
                alertService.error(error.message || error.toString());
            });
    }
    

    return (
        <Layout>
            <div className="card border-0 rounded-3 shadow-lg">
                <h4 className="card-header">Login</h4>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-3">
                            <div className="input-group mb-3">
                                <span className="input-group-text" id="basic-addon1">
                                    <Image src={userIcon} alt="User Icon" width={24} height={24} />
                                </span>
                                <input name="identification" placeholder="Identification" type="text" {...register('identification')} className={`form-control ${errors.identification ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.identification?.message}</div>
                            </div>
                        </div>
                        <div className="mb-3">
                            <div className="input-group mb-3">
                                <span className="input-group-text" id="basic-addon1">
                                    <Image src={passwordIcon} alt="Password Icon" width={20} height={20} />
                                </span>
                                <input name="password" placeholder="Password" type="password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                                <div className="invalid-feedback">{errors.password?.message}</div>
                            </div>
                        </div>
                        <button disabled={formState.isSubmitting} className="btn btn-primary w-100">
                            {formState.isSubmitting && <span className="spinner-border spinner-border-sm me-1"></span>}
                            Login
                        </button>
                        <div className="d-flex justify-content-start align-items-center text-sm">
                            <span className="text-black-500 me-2">Not a member?</span>
                            <Link className="font-bold text-slate-700 hover:text-slate-900" href="/account/register">Sign Up</Link>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}