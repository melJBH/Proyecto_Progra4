import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { Layout } from 'components/account';
import { userService, alertService } from 'services';

export default Login;

function Login() {
    const router = useRouter();

    // form validation rules
    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        password: Yup.string().required('Password is required')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit({ username, password }) {
        alertService.clear();
        return userService.login(username, password)
            .then(() => {
                // get return url from query parameters or default to '/'
                const returnUrl = router.query.returnUrl || '/';
                router.push(returnUrl);
            })
            .catch(alertService.error);
    }

    return (
        <Layout>
            <div className="h-screen flex items-center justify-center bg-gradient-to-r">
                <div className="relative">
                    <div className="absolute -top-2 -left-2 -right-2 -bottom-2 rounded-lg bg-gradient-to-r from-slate-700 via-slate-800 to-slate-600 shadow-lg animate-pulse"></div>
                    <div id="form-container" className="bg-white p-20 rounded-lg shadow-2xl w-500 relative z-10 transform transition duration-500 ease-in-out">
                        <div className="flex items-center w-full mb-4">
                            <hr className="border-t border-gray-800 flex-grow" />
                            <Image src="/user.jpg" alt="User Image" width={100} height={100} className="mx-4" />
                            <hr className="border-t border-gray-800 flex-grow" />
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div className="flex items-center border border-gray-800 rounded-lg bg-white">
                                <Image src="/pages/Images/Usuario1.png" alt="User Icon" width={24} height={24} className="ml-3" />
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    {...register('username')}
                                    required
                                    title="Please enter your username"
                                    placeholder="User(ID)"
                                    className={`w-full h-12 px-3 bg-white focus:outline-none rounded-r-lg ${errors.username ? 'border-red-500' : ''}`}
                                />
                                {errors.username && <div className="text-red-500 text-sm">{errors.username.message}</div>}
                            </div>
                            <div className="flex items-center border border-gray-800 rounded-lg bg-white">
                                <Image src="/pages/Images/candado1.png" alt="Password Icon" width={24} height={24} className="ml-3" />
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    {...register('password')}
                                    required
                                    title="Please enter your password"
                                    placeholder="Password"
                                    className={`w-full h-12 px-3 bg-white focus:outline-none rounded-r-lg ${errors.password ? 'border-red-500' : ''}`}
                                />
                                {errors.password && <div className="text-red-500 text-sm">{errors.password.message}</div>}
                            </div>
                            <div className="flex justify-between text-sm h-24">
                                <button type="submit" disabled={formState.isSubmitting} className="w-full h-12 bg-slate-700 hover:bg-slate-900 text-white text-center font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline">
                                    {formState.isSubmitting && <span className="spinner-border spinner-border-sm me-1"></span>}
                                    Login
                                </button>
                            </div>
                            <hr className="border-t border-gray-800 my-8"/>
                            <div className="flex justify-between text-sm">
                                <a className="text-black-500">Not a member?</a>
                                <Link className="font-bold text-slate-700 hover:text-slate-900" href="/pages/account2/register.jsx">Sign Up</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
}