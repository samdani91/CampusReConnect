const { isEmailExist, isStudentEmail, isFacultyEmail } = require('./checkExist');
const crypto = require('crypto');
const sendEmail = require("../sendGridApi")

const verificationCodes = new Map();

function generateVerificationCode() {
    return crypto.randomBytes(3).toString('hex').toUpperCase();
}

function ForgotPassword(email, res) {
    isEmailExist(email, async(err, exists) => {
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


        const content = {
            to: email,
            from: 'campusreconnectdu@gmail.com',
            subject: 'CampusReConnect Password Reset Verification Code',
            text: `Your verification code is: ${verificationCode}`,
            html: `<p>Your verification code is: <strong>${verificationCode}</strong></p>`
        };

        const emailResponse = await sendEmail(content);

        if (emailResponse.success) {
            return res.status(200).json({ message: 'Verification email sent' });
        } else {
            return res.status(500).json({ message: 'Error sending verification email' });
        }
    });
}

async function sendOtp(email, res) {
    try {
        const verificationCode = generateVerificationCode();

        verificationCodes.set(email, {
            code: verificationCode
        });

        const content = {
            to: email,
            from: 'campusreconnectdu@gmail.com',
            subject: 'CampusReConnect Registration Verification Code',
            text: `Your verification code is: ${verificationCode}`,
            html: `<p>Your verification code is: <strong>${verificationCode}</strong></p>`
        };

        const emailResponse = await sendEmail(content);

        if (emailResponse.success) {
            return res.status(200).json({ message: 'Verification email sent' });
        } else {
            return res.status(500).json({ message: 'Error sending verification email' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'An unexpected error occurred', error: error.message });
    }
}


module.exports = { ForgotPassword, sendOtp, verificationCodes };