import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({
        name: '',
        description: '',
        category: '',
        price: '',
        quantity: '',
    });

    const [successMessage, setSuccessMessage] = useState('');
    const [editingProductId, setEditingProductId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [productToOrder, setProductToOrder] = useState(null);
    const [orderQuantity, setOrderQuantity] = useState(1);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/products');
            const data = await response.json();

            if (response.ok) {
                setProducts(data);
            } else {
                console.error('Error fetching products:', data);
                setSuccessMessage('Error fetching products.');
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setSuccessMessage('Failed to fetch products.');
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const method = editingProductId ? 'PUT' : 'POST';
            const url = editingProductId 
                ? `http://localhost:5000/api/products/${editingProductId}` 
                : 'http://localhost:5000/api/products';

            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, quantity: form.quantity })
            });

            if (response.ok) {
                setSuccessMessage('Product saved successfully!');
                setForm({ name: '', description: '', category: '', price: '', quantity: '' });
                setEditingProductId(null);
                fetchProducts();
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                const errorData = await response.json();
                setSuccessMessage(`Error: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error saving product:', error);
            setSuccessMessage('Error saving product: ' + error.message);
        }
    };

    const handleEdit = (product) => {
        setForm(product);
        setEditingProductId(product.id);
    };

    const confirmDeleteProduct = (id) => {
        setProductToDelete(id);
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/products/${productToDelete}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setSuccessMessage('Product deleted successfully!');
                fetchProducts();
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                console.error('Error deleting product');
                setSuccessMessage('Error deleting product.');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            setSuccessMessage('Error deleting product.');
        } finally {
            setIsModalOpen(false);
            setProductToDelete(null);
        }
    };

    const confirmOrderProduct = (product) => {
        setProductToOrder(product);
        setOrderQuantity(1); 
        setIsModalOpen(true);
    };

    const handleOrder = async () => {
        if (!productToOrder) return;

        const updatedQuantity = productToOrder.quantity + parseInt(orderQuantity, 10);

        try {
            const response = await fetch(`http://localhost:5000/api/products/${productToOrder.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...productToOrder, quantity: updatedQuantity })
            });

            if (response.ok) {
                setSuccessMessage('Product quantity updated successfully!');
                fetchProducts();
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                console.error('Error updating quantity');
                setSuccessMessage('Error updating quantity.');
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            setSuccessMessage('Error updating quantity.');
        } finally {
            setIsModalOpen(false);
            setProductToOrder(null);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Product Management</h2>

            {/* Links moved to the top */}
            <div style={styles.linkContainer}>
                <Link to="/sell" style={styles.link}>Sell Products</Link>
                <Link to="/components/dashboard" style={styles.link}>Dashboard</Link>
                <Link to="/components/usermanagement" style={styles.link}>User Management</Link>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
                <input type="text" name="name" value={form.name} onChange={handleInputChange} placeholder="Product Name" required style={styles.input} />
                <textarea name="description" value={form.description} onChange={handleInputChange} placeholder="Description" required style={styles.input} />
                <input type="text" name="category" value={form.category} onChange={handleInputChange} placeholder="Category" required style={styles.input} />
                <input type="number" name="price" value={form.price} onChange={handleInputChange} placeholder="Price" required style={styles.input} />
                <input type="number" name="quantity" value={form.quantity} onChange={handleInputChange} placeholder="Initial Quantity" required style={styles.input} /> 
                <button type="submit" style={styles.submitButton}>{editingProductId ? 'Update Product' : 'Add Product'}</button>
            </form>

            {successMessage && <p style={styles.successMessage}>{successMessage}</p>}

            <h3 style={styles.productListHeading}>Product List</h3>
            <table style={styles.table}>
                <thead>
                    <tr style={styles.tableHeader}>
                        <th style={styles.tableHeaderCell}>Product Name</th>
                        <th style={styles.tableHeaderCell}>Category</th>
                        <th style={styles.tableHeaderCell}>Description</th>
                        <th style={styles.tableHeaderCell}>Price</th>
                        <th style={styles.tableHeaderCell}>Quantity</th>
                        <th style={styles.tableHeaderCell}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id} style={styles.tableRow}>
                            <td style={styles.tableCell}>{product.name}</td>
                            <td style={styles.tableCell}>{product.category}</td>
                            <td style={styles.tableCell}>{product.description}</td>
                            <td style={styles.tableCell}>${product.price}</td>
                            <td style={styles.tableCell}>{product.quantity}</td>
                            <td style={styles.tableCell}>
                                <div style={styles.actionButtons}>
                                    <button onClick={() => handleEdit(product)} style={styles.actionButton}>Edit</button>
                                    <button onClick={() => confirmDeleteProduct(product.id)} style={styles.actionButton}>Delete</button>
                                    {product.quantity <= 5 && (
                                        <button onClick={() => confirmOrderProduct(product)} style={styles.orderButton}>
                                            Order
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <h2 style={styles.modalTitle}>Confirmation</h2>
                        {productToOrder ? (
                            <>
                                <p>Enter quantity to order for {productToOrder.name}:</p>
                                <input
                                    type="number"
                                    min="1"
                                    value={orderQuantity}
                                    onChange={(e) => setOrderQuantity(e.target.value)}
                                    style={styles.input}
                                />
                                <button onClick={handleOrder} style={styles.confirmButton}>Confirm Order</button>
                            </>
                        ) : (
                            <>
                                <p>Are you sure you want to delete this product?</p>
                                <button onClick={handleDelete} style={styles.confirmButton}>Yes</button>
                            </>
                        )}
                        <button onClick={() => setIsModalOpen(false)} style={styles.cancelButton}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
    },
    heading: {
        textAlign: 'center',
        color: '#333',
    },
    linkContainer: {
        marginBottom: '20px',
        textAlign: 'center',
    },
    link: {
        margin: "0 15px",
        padding: "12px 30px",
        color: "#fff",
        backgroundColor: "#008cba",
        borderRadius: "5px",
        textDecoration: "none",
        fontWeight: "bold",
        transition: "background-color 0.3s",
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        marginBottom: '20px',
    },
    input: {
        padding: '10px',
        fontSize: '16px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        width: '100%',
        boxSizing: 'border-box',
    },
    submitButton: {
        padding: '10px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    successMessage: {
        color: 'green',
        fontWeight: 'bold',
        textAlign: 'center',
        margin: '10px 0',
    },
    productListHeading: {
        textAlign: 'center',
        marginTop: '20px',
        fontSize: '24px',
        color: '#333',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px',
        textAlign: 'left',
    },
    tableHeader: {
        backgroundColor: '#f2f2f2',
    },
    tableHeaderCell: {
        padding: '10px',
        borderBottom: '2px solid #ddd',
    },
    tableRow: {
        borderBottom: '1px solid #ddd',
        transition: 'background-color 0.3s',
    },
    tableCell: {
        padding: '10px',
    },
    actionButtons: {
        display: 'flex',
        gap: '10px',
    },
    actionButton: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '8px 16px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    orderButton: {
        backgroundColor: '#ffc107',
        color: 'white',
        padding: '8px 16px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%',
    },
    modalTitle: {
        marginBottom: '15px',
    },
    confirmButton: {
        backgroundColor: '#28a745',
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        margin: '10px 0',
    },
    cancelButton: {
        backgroundColor: '#6c757d',
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default ProductManagement;