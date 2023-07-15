const fs = require('fs');
const Tour = require(`${__dirname}/../models/tourModel`);
 
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8'));



exports.getAllTour = async  (req, res) => {
   try {
    const tours = await Tour.find();
    res.status(200).json({
        "status": "success", 
        "results": tours.length,
        "data": { tours }
        });
   }
   catch(err) {
    res.status(404).json({
        "status": "failure",
        "message": err
        });
   }
} 

exports.createTour = async  (req, res) => { 
    try {
        const newTour =  await Tour.create(req.body); 
        res.status(201).json({ 
            status: 'success',
            data: { tour: newTour } 
        });
    } 
    catch (err) {
        res.status(400).json({ // 400: Bad Request
            status: 'failure', 
            data: err
        })
    }
}
exports.getTour =  (req, res) => {
    const id = req.params.id * 1; // convert id from string to number
    console.log(typeof(id));
    const tour  = tours.find((tour) => tour.id === id);
    if(!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID' 
        })
    } 
    res.status(200).json({ 
        status: 'success',
        data: { tour } 
    });
}

exports.updateTour =  (req, res) => { 
    const id = req.params.id * 1; // convert id from string to int
    const tour = tours.find((tour) => tour.id === id);
    if(!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID' 
        })
    }
    res.status(200).json({
        status: 'success',
        data: { tour: '<Updated tour here...>' } // dummy data for now
     });
}

exports.deleteTour =  (req, res) => {
    const id = req.params.id * 1; // convert id from string to int
    const tour = tours.find((tour) => tour.id === id);
    if(!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID' 
        })
    }
    // now add code to delete the tour
    res.status(204).json({ // 204 means no content
        status: 'success',
        data: null   // null because we are deleting the data
     });
 }