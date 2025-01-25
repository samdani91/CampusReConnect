const { isEmailExist, isStudentEmail, isFacultyEmail } = require('./checkExist');
const crypto = require('crypto');
const sendgrid = require('@sendgrid/mail');

sendgrid.setApiKey('');

const verificationCodes = new Map();

function generateVerificationCode() {
    return crypto.randomBytes(3).toString('hex').toUpperCase();
}

function sendCode(email, res) {
    isEmailExist(email, (err, exists) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        if (!exists) {
            return res.status(400).json({ message: 'User does not exist!' });
        }


        const verificationCode = generateVerificationCode();

        verificationCodes.set(email, {
            code: verificationCode
        });


        const message = {
            to: email,
            from: 'campusreconnectdu@gmail.com',
            subject: 'CampusReConnect Password Reset Verification Code',
            text: `Your verification code is: ${verificationCode}`,
            html: `<p>Your verification code is: <strong>${verificationCode}</strong></p>`
        };


        sendgrid
            .send(message)
            .then(() => {
                return res.status(200).json({ message: 'Verification email sent' });
            })
            .catch((emailErr) => {
                console.error('Error sending email:', emailErr);
                return res.status(500).json({ message: 'Error sending verification email' });
            });
    });
}

function sendOtp(email,res){
    const verificationCode = generateVerificationCode();

        verificationCodes.set(email, {
            code: verificationCode
        });


        const message = {
            to: email,
            from: 'campusreconnectdu@gmail.com',
            subject: 'CampusReConnect Registration Verification Code',
            text: `Your verification code is: ${verificationCode}`,
            html: `<p>Your verification code is: <strong>${verificationCode}</strong></p>`
        };


        sendgrid
            .send(message)
            .then(() => {
                return res.status(200).json({ message: 'Verification email sent' });
            })
            .catch((emailErr) => {
                console.error('Error sending email:', emailErr);
                return res.status(500).json({ message: 'Error sending verification email' });
            });
}


module.exports = { sendCode, sendOtp, verificationCodes };