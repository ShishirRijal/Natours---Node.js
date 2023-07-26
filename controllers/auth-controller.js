const catchAsync = require('../utils/catch-async');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/app-error');
const bcrypt = require('bcrypt');
const { promisify } = require('util');

const signToken = (id) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN 
    });
}

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

    const token = signToken(newUser._id);

    res.status(201).json({ // 201 means created
        status: 'success',
        token: token,
        data: { user: newUser }
    });

});


exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body; // destructuring
    //1. check if the email and password exists
    if(!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    } 
    //2. check if the user exists && password is correct
    // we need to select the password because it is hidden by default
    const user = await User.findOne({email}).select("+password"); 
    
    if(!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    //3. if everything is ok, send token to client
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token, 
    });
});

exports.protect = catchAsync( async (req, res, next) => {
    //* 1. Getting token and check if it's there
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }
    //* 2. Verification token  
    const decoded = await  promisify(jwt.verify)(token, process.env.JWT_SECRET) ;
    //* 3. Check if user still exists 
    // if the user was deleted after the token was issued, we don't want to grant access
    const freshUser = await User.findById(decoded.id);
    if(!freshUser) {
        return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }
    //4. Check if user changed password after the token was issued
    

    //5. Grant access to protected route
    next();
});