import React, { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/authContext';
import { doCreateUserWithEmailAndPassword } from '../../../firebase/auth';

const Register = () => {
    const navigate = useNavigate();
    const { userLoggedIn } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isRegistering) {
            setIsRegistering(true);
            if (password === confirmPassword) {
                await doCreateUserWithEmailAndPassword(email, password);
            } else {
                setErrorMessage('Passwords do not match');
                setIsRegistering(false);
            }
        }
    };

    return (
        <div >
            {userLoggedIn && <Navigate to={'/planner'} replace={true} />}

            <main className="w-full h-screen flex items-center justify-center bg-gray-100">
                <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
                    <div className="text-center mb-6">
                        <img src="vit.jpg" alt="VIT Logo" className="w-24 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-800">Create a New Account</h2>
                    </div>
                    <form onSubmit={onSubmit} className="space-y-4">
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
                                autoComplete="new-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                autoComplete="off"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2 mt-1 text-gray-700 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        {errorMessage && <span className='text-red-600 font-bold'>{errorMessage}</span>}
                        <button style={{backgroundColor:' #250092d6',color:'#fff'}}
                            type="submit"
                            disabled={isRegistering}
                            className={`w-full py-3 mt-4 text-white font-semibold bg-blue-500 rounded-lg focus:outline-none hover:bg-blue-600 ${isRegistering && 'cursor-not-allowed'}`}
                        >
                            {isRegistering ? 'Signing Up...' : 'Sign Up'}
                        </button>
                        <div className="text-sm text-center">
                            Already have an account? {' '}
                            <Link to={'/login'} className="text-blue-500 hover:underline font-semibold">Sign in</Link>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Register;
