import { React, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const apiPath = 'https://tweeter-backend-2166.onrender.com/api'; 

export function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault(); // dont refresh the page

        try {
            const response = await fetch(apiPath + '/auth/register',
                {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        "username": username,
                        "email": email,
                        "password": password
                    })
                }
            )
            if (response.ok) {
                navigate('/login');
            } else {
                alert(`Error submitting form to backend: ${response.status}\n${response.statusText}`);
            }
        } catch (error) {
            console.error(`Error submitting login form: ${error.message}`);
            alert(`Error submitting login form: ${error.message}`);
        }
    };

    return (
        <div className='flex justify-center items-center h-screen bg-indigo-500'>
            <div className='w-96 p-6 shadow-lg bg-white rounded-md'>
                <h1 className='text-xl text-center'>Register</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        className="border w-full rounded-md mt-6 p-2"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => { setUsername(e.target.value) }}
                    />
                    <input
                        className="border w-full rounded-md mt-6 p-2"
                        type="text"
                        placeholder="example@gmail.com"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value) }}
                    />

                    <input
                        className="border w-full rounded-md mt-6 p-2"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value) }}
                    />
                    <div className="flex justify-center">
                        <button
                            className="mt-3 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
                            type="submit"
                        >Register</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
