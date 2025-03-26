import { useRouter } from 'next/router';
import React, { useState, useContext } from 'react';
import AppConfig from '../../../layout/AppConfig';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';

const LoginPage = () => {
    const [password, setPassword] = useState('');
    const [checked, setChecked] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);
    const router = useRouter();

    return (
        <div className="flex items-center justify-center min-h-screen bg-black relative">
            {/* Background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-black to-blue-500 opacity-30 blur-3xl"></div>
            <div className="relative z-10 w-full max-w-md p-8 bg-gray-900 bg-opacity-90 shadow-lg rounded-2xl border border-blue-500">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-white">Login</h1>
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-white text-lg mb-2">Username</label>
                    <div className="relative">
                        <InputText id="email" type="text" placeholder="Enter your username" className="w-full px-4 py-3 rounded-lg text-white bg-gray-800 border border-gray-600" />
                    </div>
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-white text-lg mb-2">Password</label>
                    <div className="relative">
                        <Password id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" toggleMask className="w-full" inputClassName="w-full px-4 py-3 rounded-lg text-white bg-gray-800 border border-gray-600" />
                    </div>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                        <Checkbox id="remember" checked={checked} onChange={(e) => setChecked(e.checked)} className="mr-2" />
                        <label htmlFor="remember" className="text-white">Remember me</label>
                    </div>
                    <a href="#" className="text-blue-400 hover:underline">Forgot password?</a>
                </div>
                <Button label="Login" className="w-full py-3 text-lg bg-blue-500 hover:bg-blue-600 text-white rounded-lg" onClick={() => router.push('/')} />
                <div className="text-center mt-4 text-white">
                    Don't have an account? <a href="#" className="text-blue-400 hover:underline">Register</a>
                </div>
            </div>
        </div>
    );
};

LoginPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig simple />
        </React.Fragment>
    );
};

export default LoginPage;