const mongoose = require('mongoose');
const User = require('./userModel');
const Tour = require('./tourModel');


const reviewSchema = new mongoose.Schema({
    review: {
        type: String, 
        required: [true, "Review can't be empty."],
    },   
    rating: {  
        type: Number, 
        default: 1, 
        min: 1, max: 5, 
    }, 
    createdAt: {
        type: Date, 
        default: Date.now(), 
    }, 
    user: {
        type: {
            type: mongoose.Schema.ObjectId, 
            ref: 'User',  
            required: [true, 'Review must belong to a user']
        }
    },
    tour: {
            type: mongoose.Schema.ObjectId, 
            ref: 'Tour', 
            required: [true, 'Rating must belong to a particular tour.']
    }
}, 
{
    toJSON: { virtuals: true}, // when data is outputted as JSON, include the virtual properties
    toObject: { virtuals: true} // when data is outputted as an object, include the virtual properties
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;