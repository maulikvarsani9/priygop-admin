import React, { useState, useEffect } from 'react';
import { FiEye, FiEyeOff, FiLock, FiMail } from 'react-icons/fi';
import { useStore } from '../store/store';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import FormInput from '../components/shared/FormInput';
import { useToast } from '../contexts/ToastContext';
import { loginSchema } from '../schemas/validationSchemas';
import Button from '../components/ui/button';

const Login: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { login, isAuthenticated } = useStore();
    const navigate = useNavigate();
    const { showError, showSuccess } = useToast();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const initialValues = {
        email: '',
        password: '',
    };

    const handleSubmit = async (values: typeof initialValues) => {
        try {
            await login(values.email, values.password);
            showSuccess('Login Successful', 'Welcome back! You have been logged in successfully.');
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error && typeof err.message === 'string'
                    ? err.message
                    : 'Invalid email or password. Please try again.';
            showError('Login Failed', errorMessage);
        }
    };

    const formik = useFormik({
        initialValues,
        validationSchema: loginSchema,
        onSubmit: handleSubmit,
        validateOnChange: false,
        validateOnBlur: false,
    });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h1 className="text-center text-4xl font-bold text-[#10b981]">
                    Priygop
                </h1>
                <h2 className="mt-6 text-center text-2xl md:text-3xl font-extrabold text-gray-900">
                    Admin Portal
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Sign in to access the admin dashboard
                </p>
            </div>

            <div className="mt-8 w-[90vw] mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white p-6 sm:p-8 shadow sm:rounded-lg">
                    <form onSubmit={formik.handleSubmit} className="space-y-6">
                        <FormInput
                            label="Email Address"
                            type="text"
                            name="email"
                            icon={<FiMail className="w-5 h-5 text-gray-400" />}
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.errors.email}
                            touched={formik.touched.email}
                        />

                        <div className="relative">
                            <FormInput
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                icon={<FiLock className="w-5 h-5 text-gray-400" />}
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.errors.password}
                                touched={formik.touched.password}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 top-8.5 right-0 pr-3 flex items-center h-fit"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <FiEyeOff className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <FiEye className="h-5 w-5 text-gray-400" />
                                )}
                            </button>
                        </div>

                        <div>
                            <Button
                                type="submit"
                                className="w-full bg-[#10b981] hover:bg-[#059669]"
                                disabled={formik.isSubmitting}
                            >
                                {formik.isSubmitting ? 'Signing in...' : 'Sign in'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;

