// src/security/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div style={{
            position: 'relative',
            height: '100vh',
            overflow: 'hidden',
            textAlign: 'center',
            padding: '20px',
            backdropFilter: 'blur(5px)', // Optional: Adds a blur effect to the background
        }}>
            <video
                autoPlay
                loop
                muted
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    minWidth: '100%',
                    minHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                    zIndex: -1,
                    transform: 'translate(-50%, -50%)',
                }}
            >
                <source src="/videos/wings.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div style={{
                position: 'relative',
                zIndex: 1,
                color: '#333', // Darker text color
                backgroundColor: '#f5ff8d', // Light background for better contrast
                padding: '20px',
                borderRadius: '8px',
                display: 'inline-block', // Center the background around text
            }}>
                <h2 style={{ margin: 0 }}>Welcome to Wings Cafe Inventory</h2>
                <p>
                    New user? <Link to="/signup" style={{ color: '#0092ca' }}>Sign up</Link>
                </p>
                <p>
                    Have an account? <Link to="/login" style={{ color: '#0092ca'}}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Home;