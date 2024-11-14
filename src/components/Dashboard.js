import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';
import 'slick-carousel/slick/slick.css'; // Import slick carousel CSS
import 'slick-carousel/slick/slick-theme.css'; // Import slick carousel theme CSS

// Import your images
import drinkImage from '../images/drink.jpeg';
import foodImage from '../images/food.jpg';
import snackImage from '../images/snack.jpeg';

Chart.register(...registerables);

const images = [
    { id: 1, src: drinkImage },
    { id: 2, src: foodImage },
    { id: 3, src: snackImage },
];

const ImageSlider = () => {
    return (
        <div className="image-slider" style={{ margin: "20px", display: "flex", justifyContent: "center" }}>
            {images.map((image) => (
                <div key={image.id} style={{ margin: "0 10px", display: "flex", justifyContent: "center" }}>
                    <img 
                        src={image.src} 
                        alt={`Slide ${image.id}`} 
                        className="rotating-img" 
                        style={{
                            animation: "rotate 10s linear infinite", // Rotation animation
                            maxWidth: "80%",                       // Set max width to 80% of its container
                            maxHeight: "300px",                   // Set max height to 300px
                            height: "auto",
                            width: "auto",
                        }} 
                    />
                </div>
            ))}
            <style jsx>{`
                @keyframes rotate {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [lowInventory, setLowInventory] = useState([]);

    const fetchProducts = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/products");
            const data = await response.json();

            if (response.ok) {
                setProducts(data);
                setLowInventory(data.filter(product => product.quantity < 5));
            } else {
                console.error("Failed to fetch products:", data);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const prepareChartData = () => {
        return {
            labels: products.map(product => product.name),
            datasets: [
                {
                    label: "Product Quantity",
                    data: products.map(product => product.quantity),
                    backgroundColor: "rgba(54, 162, 235, 0.8)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 2,
                    hoverBackgroundColor: "rgba(54, 162, 235, 1)",
                    hoverBorderColor: "rgba(0, 102, 204, 1)",
                },
            ],
        };
    };

    return (
        <div style={{
            padding: "30px",
            fontFamily: "Arial, sans-serif",
            backgroundColor: "#f5f7fa",
            color: "#333",
            minHeight: "100vh"
        }}>
            {/* Links at the top for navigation */}
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <Link to="/components/productmanagement" style={linkStyle}>
                    Product Management
                </Link>
                <Link to="/components/usermanagement" style={linkStyle}>
                    User Management
                </Link>
            </div>

            <h2 style={{
                textAlign: "center",
                color: "#2c3e50",
                fontSize: "2em",
                marginBottom: "20px",
                letterSpacing: "1px"
            }}>Dashboard</h2>

            {/* Image Slider */}
            <ImageSlider />

            {/* Bar Chart for Product Quantity */}
            <div style={{
                marginBottom: "40px",
                padding: "20px",
                backgroundColor: "#ffffff",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px"
            }}>
                <h3 style={{ color: "#2c3e50", textAlign: "center", marginBottom: "20px" }}>Product Inventory Chart</h3>
                <Bar
                    data={prepareChartData()}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                display: true,
                                position: "top",
                                labels: {
                                    color: "#333",
                                    font: { size: 14, weight: "bold" }
                                },
                            },
                        },
                        scales: {
                            x: {
                                ticks: { color: "#333" },
                                grid: { color: "rgba(0, 0, 0, 0.1)" }
                            },
                            y: {
                                ticks: { color: "#333", font: { size: 12, weight: "bold" } },
                                grid: { color: "rgba(0, 0, 0, 0.1)" }
                            },
                        },
                    }}
                />
            </div>

            {/* Product List */}
            <div style={{
                marginBottom: "40px",
                padding: "20px",
                backgroundColor: "#ffffff",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px"
            }}>
                <h3 style={{ color: "#2c3e50", marginBottom: "15px" }}>Product List</h3>
                <table style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "16px"
                }}>
                    <thead>
                        <tr style={{ backgroundColor: "#f1f3f5", color: "#333" }}>
                            {["Product Name", "Category", "Description", "Price", "Quantity"].map((header, index) => (
                                <th key={index} style={{
                                    padding: "10px",
                                    textAlign: "left",
                                    borderBottom: "2px solid #e1e4e8",
                                }}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id} style={{
                                backgroundColor: "#fff",
                                borderBottom: "1px solid #e1e4e8"
                            }}>
                                <td style={{ padding: "10px" }}>{product.name}</td>
                                <td style={{ padding: "10px" }}>{product.category}</td>
                                <td style={{ padding: "10px" }}>{product.description}</td>
                                <td style={{ padding: "10px" }}>${product.price}</td>
                                <td style={{ padding: "10px" }}>{product.quantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Low Inventory Alert */}
            <div style={{
                marginBottom: "40px",
                padding: "20px",
                backgroundColor: "#ffffff",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px"
            }}>
                <h3 style={{ color: "#e74c3c", marginBottom: "15px" }}>Low Inventory Alert</h3>
                {lowInventory.length > 0 ? (
                    <table style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: "16px"
                    }}>
                        <thead>
                            <tr style={{ backgroundColor: "#f1f3f5", color: "#333" }}>
                                <th style={{ padding: "10px", textAlign: "left", borderBottom: "2px solid #e1e4e8" }}>Product Name</th>
                                <th style={{ padding: "10px", textAlign: "left", borderBottom: "2px solid #e1e4e8" }}>Current Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lowInventory.map(product => (
                                <tr key={product.id} style={{
                                    backgroundColor: "#ffebee",
                                    color: "#e74c3c",
                                    borderBottom: "1px solid #e1e4e8"
                                }}>
                                    <td style={{ padding: "10px" }}>{product.name}</td>
                                    <td style={{ padding: "10px" }}>{product.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p style={{ color: "#333", fontSize: "16px", padding: "10px" }}>No products are low on inventory.</p>
                )}
            </div>
        </div>
    );
};

const linkStyle = {
    margin: "0 15px",
    padding: "12px 30px",
    color: "#fff",
    backgroundColor: "#008cba",
    borderRadius: "5px",
    textDecoration: "none",
    fontWeight: "bold",
    transition: "background-color 0.3s",
};

export default Dashboard;