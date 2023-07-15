const express = require('express');
const tourController = require(`${__dirname}/../controllers/tour-controller.js`);


const router = express.Router();
router.route('/')
    .get(tourController.getAllTour)
    .post(tourController.createTour); // chaining the middleware 
    // it checks the condition checkBody, if true executed the createTour 
    
router.route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = router;