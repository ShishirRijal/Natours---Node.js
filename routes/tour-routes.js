const express = require('express');
const tourController = require(`${__dirname}/../controllers/tour-controller.js`);
const authController  = require(`${__dirname}/../controllers/auth-controller.js`);

const router = express.Router();

// building a special route for the most popular searches 
router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTour);

// pipeline for the aggregation
router.route('/tour-stats').get(tourController.getTourStats);

// pipeline for the aggregation -- monthly plan
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router.route('/')
    .get(authController.protect, tourController.getAllTour)
    .post(tourController.createTour); // chaining the middleware 
    // it checks the condition checkBody, if true executed the createTour 
    
router.route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)  
    .delete(authController.protect, authController.restrictTo('admin','lead-guide'),  tourController.deleteTour);
 
module.exports = router;