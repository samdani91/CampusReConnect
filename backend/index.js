const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors")
const UserModel = require('./db/user')

const app = express();
app.use(express.json())
app.use(cors())

const PORT = 3001;

mongoose.connect("mongodb://127.0.0.1:27017/SPL2");

app.post('/register',(req,res) => {
    UserModel.create(req.body)
    .then(users => res.json(users))
    .catch(err => res.json(err))
})

app.post('/login',(req,res) => {
    const {email,password} = req.body;
    UserModel.findOne({email:email})
    .then(user => {
        if(user){
            if(user.password === password){
                res.json("Success");
            }else{
                res.json("Incorrect Password");
            }
        }else{
            res.json("User doesn't exist");
        }
    })
})

app.get('/', (req, res) => {
    res.send('Backend Server Running')
    
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

