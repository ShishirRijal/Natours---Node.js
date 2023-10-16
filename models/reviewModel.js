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
            type: mongoose.Schema.ObjectId, 
            ref: 'User',  
            required: [true, 'Review must belong to a user']
    },
    tour: {
            type: mongoose.Schema.ObjectId, 
            ref: 'Tour', 
            required: [true, 'Review must belong to a particular tour.']
    }
}, 
{
    toJSON: { virtuals: true}, // when data is outputted as JSON, include the virtual properties
    toObject: { virtuals: true} // when data is outputted as an object, include the virtual properties
});



//*  Populating all the reviews with the user and tour information when fetching 
// The mongoose has to query the user and tour data to find relevant information, 
// so it increases the response time. But that's okay, as long as acceptable delay.
reviewSchema.pre(/^find/, function(next) { 
  // populate the user from userid
    this.populate({ // populate tour ƒrom tour id
        path: 'tour', 
        select: 'name' // we only want the tour name here
    }).populate({
        path: 'user', 
        select: 'name photo' // only need the user name and photo to display
    })

    next(); //! Forgetting this takes doesn't pass execution to next middleware
});





const Review = mongoose.model('Review', reviewSchema);


module.exports = Review;