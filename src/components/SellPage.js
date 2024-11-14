import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Sell.css';

const SellPage = () => {
    const [products, setProducts] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [confirmation, setConfirmation] = useState('');
    const [error, setError] = useState('');
    const [receipt, setReceipt] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                console.error(err);
                setError('Could not load products.');
            }
        };

        fetchProducts();
    }, []);

    const handleProductChange = (e) => {
        const selectedId = e.target.value;
        setSelectedProductId(selectedId);
        const product = products.find(product => product.id === parseInt(selectedId));
        setSelectedProduct(product);
        setQuantity(0);
        setTotalAmount(product ? (product.price * 0) : 0);
    };

    const handleQuantityChange = (e) => {
        const qty = parseInt(e.target.value) || 0;
        setQuantity(qty);
        if (selectedProduct) {
            setTotalAmount(selectedProduct.price * qty);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedProduct || selectedProductId === '') {
            setError('Please select a product.');
            return;
        }

        if (quantity <= 0) {
            setError('Quantity must be greater than zero.');
            return;
        }

        if (quantity > selectedProduct.quantity) {
            setError('Insufficient stock available.');
            return;
        }

        // Deduct the quantity
        const updatedProduct = {
            ...selectedProduct,
            quantity: selectedProduct.quantity - quantity,
        };

        // Update the product on the server
        try {
            const response = await fetch(`http://localhost:5000/api/products/${selectedProductId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProduct),
            });

            if (!response.ok) {
                throw new Error('Failed to update product quantity');
            }

            setConfirmation('Sale Confirmed!');
            setError('');
            setSelectedProduct(null);
            setSelectedProductId('');

            // Create the receipt message
            setReceipt(`Receipt: Sold ${quantity} of ${selectedProduct.name} for $${totalAmount.toFixed(2)}.`);
            
            // Hide receipt after 5 seconds
            setTimeout(() => {
                setReceipt('');
            }, 5000);
        } catch (error) {
            console.error('Error updating product:', error);
            setError('Error updating product stock.');
        }
    };

    return (
        <div className="container">
            <h2>Sell Products</h2>
            {error && <p className="errorMessage">{error}</p>}
            <form onSubmit={handleSubmit} className="form">
                <div>
                    <label>
                        Select Product:
                        <select 
                            value={selectedProductId} 
                            onChange={handleProductChange}
                        >
                            <option value=''>--Select a Product--</option>
                            {products.map(product => (
                                <option key={product.id} value={product.id}>
                                    {product.name}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                {selectedProduct && (
                    <div>
                        <h4>Product Details:</h4>
                        <p><strong>Product Name:</strong> {selectedProduct.name}</p>
                        <p><strong>Category:</strong> {selectedProduct.category}</p>
                        <p><strong>Description:</strong> {selectedProduct.description}</p>
                        <p><strong>Price:</strong> ${selectedProduct.price}</p>
                        <p><strong>Available Quantity:</strong> {selectedProduct.quantity}</p>
                    </div>
                )}

                <div>
                    <label>
                        Quantity:
                        <input
                            type="number"
                            min="0"
                            value={quantity}
                            onChange={handleQuantityChange}
                        />
                    </label>
                </div>

                <h3>Total Amount: ${totalAmount.toFixed(2)}</h3>
                <button type="submit">
                    Confirm Sale
                </button>
            </form>

            {confirmation && <h3 className="confirmation">{confirmation}</h3>}
            {receipt && <div className="receipt">{receipt}</div>} {/* Display receipt */}

            {/* Link back to Product Management */}
            <Link to="/components/productmanagement" className="link">
                Product Management
            </Link>
        </div>
    );
};

export default SellPage;