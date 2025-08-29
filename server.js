const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from the public folder

// Email Transporter Setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

// Handle Contact Form Submission
app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const mailOptions = {
        from: email,
        to: process.env.EMAIL,
        subject: `CerebroScan Contact Us Message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error('Error sending email:', err);
            return res.status(500).json({ error: 'Failed to send email. Please try again.' });
        }
        res.status(200).json({ message: 'Message sent successfully!' });
    });
});

// Start the server
const PORT = 3000;
app.listen(3000, () => console.log(`Server running on http://localhost:${PORT}`));
