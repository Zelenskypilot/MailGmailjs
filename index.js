const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// Serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submissions
app.post('/send-email', async (req, res) => {
    const { username, 'phone-number': phoneNumber, amount, reference, date, email } = req.body;

    // Read the email template
    fs.readFile(path.join(__dirname, 'emailTemplate.html'), 'utf8', async (err, data) => {
        if (err) {
            return res.status(500).send('Error reading email template.');
        }

        // Replace placeholders with form data
        const emailContent = data
            .replace('{{username}}', username)
            .replace('{{phoneNumber}}', phoneNumber)
            .replace('{{amount}}', amount)
            .replace('{{reference}}', reference)
            .replace('{{date}}', date);

        // Create a transporter
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email options
        let mailOptions = {
            from: email, // User's email address
            to: 'syprasj@gmail.com', // Your company email address
            subject: 'Payment Verification Needed',
            html: emailContent
        };

        // Send email
        try {
            let info = await transporter.sendMail(mailOptions);
            res.send(`Email sent: ${info.response}`);
        } catch (error) {
            res.send(`Error sending email: ${error}`);
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
