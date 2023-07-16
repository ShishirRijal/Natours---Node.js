const { query } = require('express');
const fs = require('fs');
const Tour = require(`${__dirname}/../models/tourModel`);
const APIFeatures = require(`${__dirname}/../utils/api-features.js`);
const catchAsync = require(`${__dirname}/../utils/catch-async.js`);
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8'));



// setting an alias for the most popular searches
exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty'; 
    next();
}

exports.getAllTour = catchAsync(async  (req, res, next) => {
  
    // EXECUTE QUERY 
     const feature = new APIFeatures( Tour.find(), req.query).filter().sort().limitFields().paginate(); 
     const tours = await feature.query;
     res.status(200).json({
        "status": "success", 
        "results": tours.length,
        "data": { tours }
        });
} );




exports.createTour = catchAsync(async  (req, res, next) => {   
    const newTour =  await Tour.create(req.body); 

    res.status(201).json({ 
        status: 'success',
        data: { tour: newTour } 
    }); 
});


exports.getTour = catchAsync(async (req, res, next) => {
        const tour = await Tour.findById(req.params.id); // req.params.id is the id in the url
        res.status(200).json({ 
        status: 'success',
        data: { tour } 
        });
});


exports.updateTour =  catchAsync(async (req, res, next) => { 
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true, 
            runValidators: true
        });
        res.status(200).json({
            status: 'success',
            data: { tour }  
         });
});

exports.deleteTour =  catchAsync(async (req, res) => {
        await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({ // 204: No Content
            status: 'success',
            data: null
        })
 });

 exports.getTourStats = catchAsync(async (req, res, next) =>{
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
 });


 exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
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
 });
