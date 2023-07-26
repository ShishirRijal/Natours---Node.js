const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');



const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        trim: true,
        minLength: [3, 'Name must have more or equal than 3 characters'],
        maxLength: [20, 'Name must have less or equal than 20 characters'], 
    }, 
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: [true, 'A user already exists by this email'],
        validate: [validator.isEmail, 'Please provide a valid email'],
        lowercase: true,
    }, 
    photo: String, 
    role: {
        type: String, 
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user',  
    },
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
    } , 
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
});

//* Document middleware
// pre-save middleware runs between getting the data and saving it to the database
userSchema.pre('save', async function(next) {
    // Only run this function if password was actually modified
    if(!this.isModified('password')) return next();
    // Hash the password with cost of 12
     this.password = await bcrypt.hash(this.password, 12);

     // Delete passwordConfirm field
        this.passwordConfirm = undefined;
})

//* Instance method: available on all documents of a certain collection
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) { 
    if(this.passwordChangedAt) { // if the field exists
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp; // 100 < 200
    }
    // False means NOT changed
    return false;
}

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex'); // random string
   // store encrypted token in database
    this.passwordResetToken =  crypto.createHash('sha256').update(resetToken).digest('hex'); // digest is the output format
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes 
    console.log({resetToken}, this.passwordResetToken);
    return resetToken; // unencrypted token sent to user through email
}
 

const User = mongoose.model('User', userSchema);

module.exports = User;