// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './security/Home';
import About from './security/About';
import Contact from './security/Contact';
import Signup from './security/SignUp';
import Login from './security/Login';
import Settings from './security/Settings'; // Importing Settings
import Dashboard from './components/Dashboard';
import ProductManagement from './components/ProductManagement';
import UserManagement from './components/UserManagement';
import SellPage from './components/SellPage';
import './App.css'; 

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [redirectToHome, setRedirectToHome] = useState(false);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUserData = JSON.parse(userData);
            setIsLoggedIn(true);
            setUserName(parsedUserData.name || 'User');
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUserName('');
        setRedirectToHome(true);
    };

    useEffect(() => {
        if (redirectToHome) {
            setRedirectToHome(false);
        }
    }, [redirectToHome]);

    return (
        <Router>
            <div>
                <div className="header">
                    <nav>
                        <Link to="/">Home</Link>
                        <Link to="/about">About Us</Link>
                        <Link to="/contact">Contact Us</Link>
                    </nav>

                    {isLoggedIn && (
                        <div className="profile-section">
                            <div className="profile-info">
                                <p>{userName}</p>
                                <button className="logout-button" onClick={handleLogout}>Logout</button>
                            </div>
                        </div>
                    )}
                </div>

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUserName={setUserName} />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/components/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
                    <Route path="/components/productmanagement" element={isLoggedIn ? <ProductManagement /> : <Navigate to="/login" />} />
                    <Route path="/components/usermanagement" element={isLoggedIn ? <UserManagement /> : <Navigate to="/login" />} />
                    <Route path="/sell" element={isLoggedIn ? <SellPage /> : <Navigate to="/login" />} />
                </Routes>

                {redirectToHome && <Navigate to="/" replace />}
            </div>
        </Router>
    );
}

export default App;
