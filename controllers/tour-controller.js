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
exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id); // req.params.id is the id in the url
        res.status(200).json({ 
        status: 'success',
        data: { tour } 
        });
    }
    catch(err) {
        res.status(404).json({
            status: 'failure',
            message: err
        })
    }
}

exports.updateTour =  async (req, res) => { 
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true, 
            runValidators: true
        });
        res.status(200).json({
            status: 'success',
            data: { tour } // dummy data for now
         });
    }
    catch(err) {
        res.status(400).json({
            status: 'failure',
            data: err
        });
    }
    
}

exports.deleteTour =  async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({ // 204: No Content
            status: 'success',
            data: null
        })
    } catch(err) {
        res.status(404).json({ 
            status: 'failure',
            message: err
        });
    }
 }