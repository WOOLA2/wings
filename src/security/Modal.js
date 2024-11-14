// Modal.js
import React from 'react';

const Modal = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
        }}>
            <div style={{
                background: 'white',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                textAlign: 'center'
            }}>
                <h2>{message}</h2>
                <p>Do you want to save your password?</p>
                <button onClick={onClose} style={{
                    marginTop: '10px',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    border: 'none',
                    backgroundColor: '#1DA1F2',
                    color: '#fff',
                    cursor: 'pointer'
                }}>Close</button>
            </div>
        </div>
    );
};

export default Modal;