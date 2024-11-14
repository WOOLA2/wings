import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const [settings, setSettings] = useState({
        username: '',
        email: '',
        newPassword: '',
        confirmNewPassword: '',
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings((prevSettings) => ({
            ...prevSettings,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if new passwords match
        if (settings.newPassword !== settings.confirmNewPassword) {
            setMessage('New passwords do not match.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: settings.username,
                    email: settings.email,
                    newPassword: settings.newPassword,
                }),
            });

            const result = await response.json();
            console.log('Password Change Response:', result); // Log response for debugging

            // Check if the response was successful
            if (response.ok) {
                setMessage('Password updated successfully!');
                // Clear the form fields
                setSettings({
                    username: '',
                    email: '',
                    newPassword: '',
                    confirmNewPassword: '',
                });
                navigate('/components/dashboard'); // Redirect after success
            } else {
                // If there's an error message from the server, show it
                setMessage(result.message || 'Error: Unable to update the password.');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            setMessage('There was an error updating the password. Please try again.');
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
                }}>Change Password</div>
                <p>Change your password here.</p>
                {message && <p className="confirmation-message" style={{ color: 'red' }}>{message}</p>}

                <form onSubmit={handleSubmit} style={{ textAlign: 'left', marginTop: '30px' }}>
                    <div className="form-group" style={{ marginBottom: '12px' }}>
                        <label htmlFor="username" style={{ marginBottom: '4px', display: 'block' }}>Username:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={settings.username}
                            onChange={handleChange}
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
                    </div>
                    <div className="form-group" style={{ marginBottom: '12px' }}>
                        <label htmlFor="email" style={{ marginBottom: '4px', display: 'block' }}>Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={settings.email}
                            onChange={handleChange}
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
                    </div>
                    <div className="form-group" style={{ marginBottom: '12px' }}>
                        <label htmlFor="newPassword" style={{ marginBottom: '4px', display: 'block' }}>New Password:</label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={settings.newPassword}
                            onChange={handleChange}
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
                    </div>
                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label htmlFor="confirmNewPassword" style={{ marginBottom: '4px', display: 'block' }}>Confirm New Password:</label>
                        <input
                            type="password"
                            id="confirmNewPassword"
                            name="confirmNewPassword"
                            value={settings.confirmNewPassword}
                            onChange={handleChange}
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
                    </div>
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
                    }}>Change Password</button>
                </form>
            </div>
        </div>
    );
};

export default Settings;
