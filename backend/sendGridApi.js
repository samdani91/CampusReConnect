require('dotenv').config();
const sendgrid = require('@sendgrid/mail');
const apiKey = process.env.SENDGRID_API_KEY;

sendgrid.setApiKey(apiKey);

async function sendEmail(content) {
    try {
        await sendgrid.send(content);
        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, message: 'Error sending email', error };
    }
}

module.exports = sendEmail;