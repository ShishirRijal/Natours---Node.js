const mongoose = require('mongoose');
const validator = require('validator');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        trim: true,
        minLength: [3, 'Name must have more or equal than 3 characters'],
        maxLength: [20, 'Name must have less or equal than 20 characters'], 
        validate: validator.isAlpha
    }, 
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: [true, 'A user already exists by this email'],
        validate: [validator.isEmail, 'Please provide a valid email'],
        lowercase: true,
    }, 
    photo: String, 
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minLength: [8, 'Password must have more or equal than 8 characters'],
        trim: true, 
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // This only works on CREATE and SAVE!!!
            validator: function(el) {
                return el === this.password; 
            }, 
            message: 'Passwords are not the same!'
        }
    } 
});

const User = mongoose.model('User', userSchema);

module.exports = User;