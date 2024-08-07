const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));

// Serve the HTML form
app.get('/', (req, res) => {
    res.send(`
        <form action="/send-email" method="post">
            <label for="to">To:</label>
            <input type="email" id="to" name="to" required><br><br>
            <label for="subject">Subject:</label>
            <input type="text" id="subject" name="subject" required><br><br>
            <label for="message">Message:</label>
            <textarea id="message" name="message" required></textarea><br><br>
            <button type="submit">Send Email</button>
        </form>
    `);
});

// Handle form submissions
app.post('/send-email', async (req, res) => {
    const { to, subject, message } = req.body;

    // Create a transporter
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'syprasj@gmail.com',
            pass: 'irqd ausm vhan puow'
        }
    });

    // Email options
    let mailOptions = {
        from: 'syprasj@gmail.com',
        to: to,
        subject: subject,
        text: message
    };

    // Send email
    try {
        let info = await transporter.sendMail(mailOptions);
        res.send(`Email sent: ${info.response}`);
    } catch (error) {
        res.send(`Error sending email: ${error}`);
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
