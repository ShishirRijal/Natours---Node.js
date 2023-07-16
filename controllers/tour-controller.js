const { query } = require('express');
const fs = require('fs');
const Tour = require(`${__dirname}/../models/tourModel`);
const APIFeatures = require(`${__dirname}/../utils/api-features.js`);
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8'));



// setting an alias for the most popular searches
exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty'; 
    next();
}

exports.getAllTour = async  (req, res) => {
    try {
    // EXECUTE QUERY 
     const feature = new APIFeatures( Tour.find(), req.query).filter().sort().limitFields().paginate(); 
     const tours = await feature.query;
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

 exports.getTourStats = async (req, res) =>{
    try{
        const stats = await Tour.aggregate([
             {
                $match :{ ratingsAverage: { $gte: 4.5}}, 
             },
             {
                $group : {
                    _id: { $toUpper: '$difficulty'}, 
                    numTours : { $sum: 1},
                    numRatings: { $sum: '$ratingsQuantity'},
                    averageRating: { $avg: '$ratingsAverage'}, 
                    averagePrice: { $avg: '$price'}, 
                    minPrice: { $min: '$price'}, 
                    maxPrice: { $max: '$price'}
                }
             }
        ]);
        res.status(200).json({
            status: 'success',
            data: { stats }
        })
    }
    catch(err) {
        res.status(404).json({
            status: 'failure',
            message: err
        })
    }
 }


 exports.getMonthlyPlan = async (req, res) => {
    try{ 
        const year = req.params.year * 1;  
        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates' // deconstructs an array field from the input documents to output a document for each element
            },
            {
                $match: { 
                    startDates : { 
                        $gte: new Date(`${year}-01-01`), 
                        $lte: new Date(`${year}-12-31`)
                    },
                }
            }, 
            {
                $group: {
                    _id: { $month: '$startDates'}, // group by month
                    numTourStarts: { $sum: 1},
                    tours: { $push: '$name'} // push the name of the tours into an array
                },
            }, {
                $addFields: { month: '$_id'} // add a new field called month
            }, 
            {
                $project: {
                    _id: 0 // hide the id field
                }
            }, 
            {
                $limit: 6,
            },
            {
                $sort: { numTourStarts: -1} // sort by the number of tour starts
            }
        ]);

        res.status(200).json({
            status: 'success',
            data: { plan }
        });
    }
    catch(err) {
        res.status(404).json({
            status: 'failure',
            message: err
        })
    }
 }
