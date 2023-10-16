const express = require('express'); 
const reviewController = require(`${__dirname}/../controllers/review-controller.js`);
const authController = require(`${__dirname}/../controllers/auth-controller.js`);

const router = express.Router();


router.route('/')
.get(reviewController.getAllReviews)
.post(authController.protect, authController.restrictTo('user'),   reviewController.createReview); 
// Here we have to make sure that only the regular authenticated users can post the review
// Neither an anonymous user, nor admin, nor the tour guide 



 
module.exports  = router