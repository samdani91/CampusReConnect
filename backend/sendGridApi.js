const sendgrid = require('@sendgrid/mail');

sendgrid.setApiKey('');

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