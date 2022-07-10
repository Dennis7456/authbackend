const express = require('express');
const app = express();
const bodyParser = require('body-parser');
//require db connection
const dbConnect = require('./db/dbConnect');
const User = require('./db/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('./auth');

//body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));

//execute db connection
dbConnect();

//Prevent CORS Errors
app.use((request, response, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
    );
    res.setHeader(
        'Access-Controll-Allow-Methods',
        'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    );
    next();
})

app.get('/', (request, response, next) => {
    response.json({ message: 'Hello and welcome to Authbackend API using NodeJS and Express' });
    next();
});

app.post('/register', (request, response) =>{
//hash the password 10 salt rounds
bcrypt.hash(request.body.password, 10)
.then((hashedPassword) => {
    const user = new User({
        email: request.body.email,
        password: hashedPassword,
    });
    //save new user
    user.save()
    //return response after saving user
    .then((result) => {
        response.status(200).send({
            message: 'User created successfully',
            result,
        });
    })
})
//catch error if password not hashed successfully
.catch((error) => {
    response.status(500).send({
        message: "Error while hashing password!", error,
    });
})
});

app.post('/login', (request, response) => {
    User.findOne({email: request.body.email})
    .then((user) => {
        bcrypt.compare(request.body.password, user.password)
        .then((passwordCheck) => {
            //check if password matches
            if(!passwordCheck) {
                return response.status(400).send({
                    message: 'Passwords do not match',
                    error
                });
            }

            //create JWT token
            const token = jwt.sign(
                {
                    userId: user._id,
                    userEmail: user.email,
                }, 'RANDOM-TOKEN',
                {
                    expiresIn: '24h'
                });
            //return success message
            response.status(200).send({
                message: 'Login Successful',
                email: user.email,
                token,
            });
        })
        .catch((error) => {
            response.status(400).send({
                message: 'Passwords do not match',
                error,
            });
        })
    })
    .catch((error) => {
        response.status(404).send({
            message: 'Email not found',
            error,
        });
    });
})

//free endpoint
app.get('/free-endpoint', (request, response) => {
    response.json({message: 'You are free to access this endpoint anytime'});
});

//authentication endpoint
app.get('/protected-endpoint', auth, (request, response) => {
    response.json({message: 'You are authorised to access this endpoint'});
})

module.exports = app