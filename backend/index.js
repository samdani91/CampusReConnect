const express = require('express');
const cors = require('cors');
const checkSignUp = require('./Authentication/checkSignUp');
const checkLogin = require('./Authentication/checkLogin');
const {sendCode,verificationCodes} = require('./Authentication/sendCode');
const passwordReset = require('./Authentication/passwordReset');


const PORT = 3001;

const app = express();
app.use(cors());
app.use(express.json());

app.post('/register', async (req, res) => {
    const { name, email, department, role, password } = req.body;

    try {
        // Call the checkSignUp function and handle the response
        await checkSignUp(name, email, department, role, password, res);
    } catch (err) {
        // console.error('Error in registration:', err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }

});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    checkLogin(email, password, (err, isValid) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (isValid) {
            return res.status(200).json({ message: 'Login Successful' });
        } else {
            return res.status(401).json({ message: 'Credentials Mismatch' });
        }
    });
});

app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        await sendCode(email, res);
    } catch (err) {
        // console.log(err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

app.post('/verify-code', async (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        // console.log('Missing email or code:', { email, code });
        return res.status(400).json({ message: 'Email and code are required' });
    }

    try {
        if (!verificationCodes.has(email)) {
            // console.log('Verification code not found for email:', email);
            return res.status(400).json({ message: 'Verification code not found or expired' });
        }

        const storedCode = verificationCodes.get(email).code;

        // console.log('Stored code:', storedCode, 'Received code:', code);

        if (storedCode === code) {
            verificationCodes.delete(email);
            return res.status(200).json({ message: 'Code verified' });
        } else {
            return res.status(400).json({ message: 'Invalid verification code' });
        }
    } catch (err) {
        console.error('Error verifying code:', err);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});



app.post('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;

    // console.log('email and password:',{email,newPassword});
    try {
        await passwordReset(email, newPassword, res);
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

app.get('/', (req, res) => {
    res.send('Backend Server Running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});