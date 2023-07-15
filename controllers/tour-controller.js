const { query } = require('express');
const fs = require('fs');
const Tour = require(`${__dirname}/../models/tourModel`);
 
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8'));



// setting an alias for the most popular searches
exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty'; 
    next();
}

class APIFeatures {
    constructor(query, queryString)  {
        this.query = query;
        this.queryString = queryString;
    }
    filter() {
        // 1A) Filtering
        const queryObj = {...this.queryString}; // make a copy of the query object
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(field => delete queryObj[field]); // delete the fields from the query object
        // 1B) Advanced Filtering
        let queryStr = JSON.stringify(queryObj); // convert the query object to a string
        queryStr =  queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`); // replace the operators with the dollar sign
        this.query =  this.query.find(JSON.parse(queryStr));
        return this;
    }
    sort() {
        if(this.queryString.sort) {
            // sort=price,ratingsAverage
            const sortBy = this.queryString.sort.split(',').join(' '); // replace the comma with a space
            this.query = this.query.sort(sortBy);  
        } else {
            this.query = this.query.sort('-createdAt'); // sort by the most recent 
        }
        return this;
    }
    limitFields() {
        if(this.queryString.fields) { 
            // query = query.select('name duration price'); // this way of selecting the fields is called projecting
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        }else {
            this.query = this.query.select('-__v'); // exclude the __v field
        }
        return this;
    }
    paginate()  {
        const page = this.queryString.page * 1 || 1; // convert the string to a number
        const limit = this.queryString.limit  * 1 || 10;
        const skip = (page -1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this; 
    }

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