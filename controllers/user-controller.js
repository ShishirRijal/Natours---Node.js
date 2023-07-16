const express = require('express');
const catchAsync = require('../utils/catch-async');
const User = require('../models/userModel');



exports.getAllUsers = (req, res) => { 
    res.status(500).json({ // 500 means internal server error
        status: 'error',
        message: 'This route is not yet defined'
       });
}
exports.createUser = catchAsync(async (req, res, next) => { 
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

    res.status(201).json({ // 201 means created
        status: 'success',
        data: { user }
    });
   });
exports.deleteUser = (req, res) => { 
     res.status(500).json({  
        status: 'error',
        message: 'This route is not yet defined'
           });
    }
exports.updateUser = (req, res) => { 
    res.status(500).json({  
        status: 'error',
        message: 'This route is not yet defined'
        });
    }
exports.getUser = (req, res) => { 
        res.status(500).json({  
            status: 'error',
            message: 'This route is not yet defined'
        });
    }
       