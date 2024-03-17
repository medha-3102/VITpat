import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from '../../../firebase/auth';
import { useAuth } from '../../../contexts/authContext';

import styles from "./styles.module.css";

const Login = () => {
    const { userLoggedIn } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true);
            await doSignInWithEmailAndPassword(email, password);
            // doSendEmailVerification()
        }
    };

    const onGoogleSignIn = (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true);
            doSignInWithGoogle().catch(err => {
                setIsSigningIn(false);
            });
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f3f4f6' }}>
            {userLoggedIn && (<Navigate to={'/planner'} replace={true} />)}

            <main className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
                <div className="text-center">
                    <img src="vit.jpg" alt="VIT Logo" className="w-24 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
                </div>
                <form onSubmit={onSubmit} className="mt-8 space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {errorMessage && <span className='text-red-600 font-bold'>{errorMessage}</span>}
                    <button style={{backgroundColor:' #250092d6'}}
                        type="submit"
                        disabled={isSigningIn}
                        className={`w-full py-3 mt-4 text-white font-semibold bg-blue-500 rounded-lg focus:outline-none hover:bg-blue-600 ${isSigningIn && 'cursor-not-allowed'}`}
                    >
                        {isSigningIn ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
                <p className="mt-4 text-sm text-center text-gray-600">
                    Don't have an account? <Link to="/register" className="font-semibold text-blue-500 hover:underline">Sign up</Link>
                </p>
                <div className="flex items-center justify-center mt-4">
                    <hr className="flex-grow border-gray-300" />
                    <span className="mx-3 text-sm font-semibold text-gray-600">OR</span>
                    <hr className="flex-grow border-gray-300" />
                </div>
                <button
                    disabled={isSigningIn} style={{backgroundColor:' #250092d6',color:'#fff'}}
                    onClick={onGoogleSignIn}
                    className={`w-full flex items-center justify-center py-3 mt-4 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg focus:outline-none hover:bg-gray-100 ${isSigningIn && 'cursor-not-allowed'}`}
                >
                    <svg className="w-5 h-5 mr-2 text-blue-500" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z" fill="#4285F4" />
                        <path d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z" fill="#34A853" />
                        <path d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z" fill="#FBBC04" />
                        <path d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z" fill="#EA4335" />
                    </svg>
                    {isSigningIn ? 'Signing In...' : 'Continue with Google'}
                </button>
            </main>
        </div>
    );
};

export default Login;
