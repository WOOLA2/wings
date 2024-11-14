import React from 'react';
import './About.css'; // Import the CSS file

const About = () => {
    return (
        <div className="about-container">
            <h2>About Us</h2>
            <p>
                Welcome to Wings Cafe! We are more than just a cafe; we are a community of passionate individuals dedicated to serving our customers the best wings in town.
            </p>
            <p>
                Since our establishment, we have strived to create a workplace that fosters growth, teamwork, and excellence. Our employees are our greatest asset, and we believe that a supportive environment leads to exceptional service.
            </p>
            <h3>Mission Statement</h3>
            <p>
                Our mission is to provide high-quality food and outstanding service while creating a positive work atmosphere for our employees. We value each member of our team and aim to empower them through training and development opportunities.
            </p>
            <h3>Our Values</h3>
            <ul>
                <li><strong>Teamwork:</strong> We believe in working together to achieve common goals.</li>
                <li><strong>Integrity:</strong> We act with honesty and transparency in all that we do.</li>
                <li><strong>Customer Orientation:</strong> Our customers are our priority, and their satisfaction drives us.</li>
                <li><strong>Continuous Improvement:</strong> We are committed to learning and growing as individuals and as a company.</li>
            </ul>
            <h3>Join Us!</h3>
            <p>
                As a member of the Wings Cafe team, you'll be part of a culture that encourages innovation and creativity. Together, let's continue to elevate the Wings Cafe experience for our customers and for each other!
            </p>
        </div>
    );
};

export default About;
