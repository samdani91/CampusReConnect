const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors")
const UserModel = require('./db/user')
const sendgrid = require('@sendgrid/mail');

const app = express();
app.use(express.json())
app.use(cors())

const PORT = 3001;
sendgrid.setApiKey('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');
let verificationCode;

mongoose.connect("mongodb://127.0.0.1:27017/SPL2");

app.post('/register', (req, res) => {
    UserModel.create(req.body)
        .then(users => res.json(users))
        .catch(err => res.json(err))
})

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    UserModel.findOne({ email: email })
        .then(user => {
            if (user) {
                if (user.password === password) {
                    res.json("Success");
                } else {
                    res.json("Incorrect Password");
                }
            } else {
                res.json("User doesn't exist");
            }
        })
})

app.post('/forgot-password', (req, res) => {
    const { email } = req.body;

    verificationCode = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit code

    const msg = {
        to: email,
        from: 'samdanimozumder3030@gmail.com',
        subject: 'Password Reset Verification Code of CampusReConnect',
        text: `Your verification code is ${verificationCode}.`,
        html: `<strong>Your verification code is ${verificationCode}.</strong>`,
    };

    UserModel.findOne({ email: email })
        .then(user => {
            if (user) {
                // console.log(user)
                sendgrid
                    .send(msg)
                    .then(() => {
                        res.status(200).send('Verification email sent');
                    })
                    .catch((error) => {
                        console.error(error);
                        res.status(500).send('Error sending verification email');
                    });
            } else {
                res.json("User doesn't exist");
            }
        })




});

app.post('/verify-code', (req, res) => {
    const { email, code } = req.body;

    UserModel.findOne({ email })
        .then((user) => {
            if (user && verificationCode === parseInt(code)) { // Ensure code comparison is type-safe
                res.status(200).json({ message: 'Code verified' }); // Respond with JSON
            } else {
                res.status(400).json({ message: 'Invalid code' });
            }
        })
        .catch((err) => res.status(500).json({ message: 'Error verifying code' }));
});


app.post('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        // Find the user by email
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Compare the new password with the current password (not hashed)
        if (newPassword === user.password) {
            return res.status(400).send('New password cannot be the same as the old password');
        }

        // Update the user's password
        user.password = newPassword;

        await user.save();

        res.status(200).send('Password updated');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error resetting password');
    }
});


app.get('/', (req, res) => {
    res.send('Backend Server Running')

});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

