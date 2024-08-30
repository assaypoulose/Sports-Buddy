import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserLogin = ({ theme }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null); // State for managing errors
    const navigate = useNavigate();

    const baseURL = import.meta.env.VITE_BACKEND_URL;

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${baseURL}/users/login`, { email, password });
            // Save the token to localStorage or use context to save it
            localStorage.setItem('token', response.data.token);
            // Navigate to the home page after successful login
            navigate('/user-dashboard');
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="flex flex-col gap-7 w-[500px] h-[500px] items-center justify-center border border-gray-300 rounded-lg p-6 shadow-lg">
                <h1 className="text-3xl mb-6">User Login</h1>
                <form className="w-full max-w-sm" onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-gray-950 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter your email"
                            required
                        />
                        <p>Email: assay@gmail.com</p>
                    </div>
                    <div className="mb-10 mt-6">
                        <label className="block text-gray-950 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Enter your password"
                            required
                        />
                        <p>Password: assay123</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-[#101b43] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline border border-gray-50"

                        >
                            Login
                        </button>
                    </div>
                </form>
                <p>
        Don't have an account? <a href="/register/user" className="text-gray-50"><u>Register here</u></a>
      </p>
            </div>
        </div>
    );
};

export default UserLogin;
