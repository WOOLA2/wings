import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({
        names: '',
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.names,
                    email: formData.email,
                    password: formData.password
                }),
            });

            const result = await response.json();
            if (response.ok) {
                setMessage('Signup successful!');
                setTimeout(() => {
                    navigate('/login'); // Redirect to the login page
                }, 2000);
            } else {
                setMessage('Error: ' + (result.errors ? result.errors.map(err => err.msg).join(', ') : result.message));
            }
        } catch (error) {
            console.error('Signup error:', error);
            setMessage('There was an error signing up. Please try again.');
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
                }}>SIGN UP</div>
                <form onSubmit={handleSubmit} style={{ textAlign: 'left', marginTop: '30px' }}>
                    <label style={{ marginBottom: '4px', display: 'block' }}>Name</label>
                    <input
                        type="text"
                        name="names"
                        value={formData.names}
                        onChange={handleChange}
                        placeholder="Enter your name"
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
                    <label style={{ marginBottom: '4px', display: 'block' }}>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
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
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Min 6 characters long"
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
                    }}>Sign Up</button>
                </form>
                {message && <p>{message}</p>}
                <p>
                    Already have an account? <Link to="/login" style={{ color: '#1DA1F2' }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
