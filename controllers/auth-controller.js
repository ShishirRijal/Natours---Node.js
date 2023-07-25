const catchAsync = require('../utils/catch-async');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.signup = catchAsync(async (req, res, next) => { 
    // ! Serious security flaw: anyone can create an admin user by specifying admin: true in the request body
    // const user = await User.create(req.body); 
    // * To fix this, we will create a new object with only the fields we want
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        photo: req.body.photo,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN 
    });

    res.status(201).json({ // 201 means created
        status: 'success',
        token: token,
        data: { user }
    });

});