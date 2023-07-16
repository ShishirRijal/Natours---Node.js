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
    const user = await User.create(req.body);
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
       