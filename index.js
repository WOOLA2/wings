// server.js

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Database connection setup
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
    console.log('Connected to the database.');
});

// User Registration Validation
const validateUserRegistration = [
    body('name').notEmpty().withMessage('Name is required.'),
    body('email').isEmail().withMessage('Valid email is required.'),
    body('password').notEmpty().withMessage('Password is required.'),
];

// User Registration Endpoint
app.post('/api/users', validateUserRegistration, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    db.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, password], // Storing password as plain text (consider hashing)
        (err, results) => {
            if (err) {
                console.error('Error adding user:', err);
                return res.status(500).json({ error: 'Error adding user: ' + (err.message || err) });
            }
            res.status(201).json({ id: results.insertId, message: 'User added successfully' });
        }
    );
});

// User Login Endpoint
app.post('/api/login', [
    body('email').isEmail().withMessage('Valid email is required.'),
    body('password').notEmpty().withMessage('Password is required.'),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Error querying user:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.length === 0 || results[0].password !== password) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        res.json({ message: 'Login successful', userId: results[0].id });
    });
});

// Update User Endpoint
app.put('/api/users/:id', [
    body('name').notEmpty().withMessage('Name is required.'),
    body('email').isEmail().withMessage('Valid email is required.'),
    body('password').optional().notEmpty().withMessage('Password is required if updated.'),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, email, password } = req.body;

    // Update query includes password if it is provided
    const query = `UPDATE users SET name = ?, email = ?${password ? ', password = ?' : ''} WHERE id = ?`;
    const params = password ? [name, email, password, id] : [name, email, id];

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error updating user:', err);
            return res.status(500).json({ error: 'Error updating user: ' + (err.message || err) });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User updated successfully' });
    });
});

// Delete User Endpoint
app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM users WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Error deleting user:', err);
            return res.status(500).json({ error: 'Failed to delete user: ' + (err.message || 'Unknown error') });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    });
});

// Fetch all users
app.get('/api/users', (req, res) => {
    db.query('SELECT id, name, email FROM users', (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(results);
    });
});

// Product Validation
const validateProduct = [
    body('name').notEmpty().withMessage('Product name is required.'),
    body('description').notEmpty().withMessage('Description is required.'),
    body('category').notEmpty().withMessage('Category is required.'),
    body('price').isNumeric().withMessage('Price must be a number.'),
    body('quantity').isNumeric().withMessage('Quantity must be a number.'),
];

// Add a new product
app.post('/api/products', validateProduct, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, category, price, quantity } = req.body;

    db.query(
        'INSERT INTO products (name, description, category, price, quantity) VALUES (?, ?, ?, ?, ?)',
        [name, description, category, price, quantity],
        (err, results) => {
            if (err) {
                console.error('Error adding product:', err.message || err);
                return res.status(500).json({ error: 'Error adding product: ' + (err.message || err) });
            }
            res.status(201).json({ id: results.insertId, message: 'Product added successfully' });
        }
    );
});

// Fetch all products
app.get('/api/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) {
            console.error('Error fetching products:', err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(results);
    });
});

// Update an existing product
app.put('/api/products/:id', validateProduct, (req, res) => {
    const { id } = req.params;
    const { name, description, category, price, quantity } = req.body;

    db.query(
        'UPDATE products SET name = ?, description = ?, category = ?, price = ?, quantity = ? WHERE id = ?',
        [name, description, category, price, quantity, id],
        (err) => {
            if (err) {
                console.error('Error updating product:', err.message || err);
                return res.status(500).json({ error: 'Error updating product: ' + (err.message || err) });
            }
            res.json({ message: 'Product updated successfully' });
        }
    );
});

// Delete a product
app.delete('/api/products/:id', (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM products WHERE id = ?', [id], (err) => {
        if (err) {
            console.error('Error deleting product:', err.message);
            return res.status(500).json({ error: 'Error deleting product: ' + err.message });
        }
        res.json({ message: 'Product deleted successfully' });
    });
});

// Update Password Endpoint
app.post('/api/change-password', [
    body('username').notEmpty().withMessage('Username is required.'),
    body('email').isEmail().withMessage('A valid email is required.'),
    body('newPassword').notEmpty().withMessage('New password is required.'),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, newPassword } = req.body;

    // Verify user exists 
    db.query('SELECT * FROM users WHERE name = ? AND email = ?', [username, email], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Update password directly without hashing
        db.query('UPDATE users SET password = ? WHERE name = ? AND email = ?', [newPassword, username, email], (err) => {
            if (err) {
                console.error('Error updating password:', err);
                return res.status(500).json({ message: 'Error updating password.' });
            }
            res.json({ message: 'Password updated successfully' });
        });
    });
});


// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
