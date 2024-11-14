import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ setIsLoggedIn, setUserName }) => {
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            const result = await response.json();

            if (response.ok) {
                setMessage('Login successful!');
                setIsLoggedIn(true);
                setUserName(result.name);
                localStorage.setItem('user', JSON.stringify({ name: result.name }));
                setTimeout(() => {
                    navigate('/components/Dashboard');
                }, 1000);
            } else {
                setMessage(result.message || 'Invalid email or password.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setMessage('There was an error logging in. Please try again.');
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: '#f0f2f5',
        }}>
            <div style={{
                width: '900px',
                borderRadius: '20px',
                padding: '40px',
                boxSizing: 'border-box',
                background: '#ecf0f3',
                boxShadow: '14px 14px 20px #cbced1, -14px -14px 20px white',
                textAlign: 'center'
            }}>
                <div style={{
                    height: '100px',
                    width: '100px',
                    margin: 'auto',
                    borderRadius: '50%',
                    boxShadow: '7px 7px 10px #cbced1, -7px -7px 10px white'
                }}></div>
                <div style={{
                    marginTop: '10px',
                    fontWeight: '900',
                    fontSize: '1.8rem',
                    color: '#1DA1F2',
                    letterSpacing: '1px'
                }}>LOGIN</div>
                <form onSubmit={handleSubmit} style={{ textAlign: 'left', marginTop: '30px' }}>
                    <label style={{ marginBottom: '4px', display: 'block' }}>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={credentials.email}
                        onChange={handleChange}
                        placeholder="example@test.com"
                        required
                        style={{
                            background: '#ecf0f3',
                            padding: '10px',
                            paddingLeft: '20px',
                            height: '50px',
                            fontSize: '14px',
                            borderRadius: '50px',
                            boxShadow: 'inset 6px 6px 6px #cbced1, inset -6px -6px 6px white',
                            marginBottom: '12px',
                            width: '100%',
                            border: 'none',
                            outline: 'none',
                            boxSizing: 'border-box'
                        }}
                    />
                    <label style={{ marginBottom: '4px', display: 'block' }}>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                        style={{
                            background: '#ecf0f3',
                            padding: '10px',
                            paddingLeft: '20px',
                            height: '50px',
                            fontSize: '14px',
                            borderRadius: '50px',
                            boxShadow: 'inset 6px 6px 6px #cbced1, inset -6px -6px 6px white',
                            marginBottom: '20px',
                            width: '100%',
                            border: 'none',
                            outline: 'none',
                            boxSizing: 'border-box'
                        }}
                    />
                    <button type="submit" style={{
                        color: 'white',
                        background: '#1DA1F2',
                        height: '40px',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontWeight: '900',
                        boxShadow: '6px 6px 6px #cbced1, -6px -6px 6px white',
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        transition: '0.5s'
                    }}>Login</button>
                </form>
                {message && <p>{message}</p>}
                <p>
                    Forgot password? <Link to="/settings" style={{ color: '#1DA1F2' }}>Go to Settings</Link>
                </p>
                <p>
                    No account? <Link to="/signup" style={{ color: '#1DA1F2' }}>Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
