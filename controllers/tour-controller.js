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
        const queryObj = {...this.queryStr}; // make a copy of the query object
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(field => delete queryObj[field]); // delete the fields from the query object
        // 1B) Advanced Filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr =   queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`); // replace the operators with the dollar sign
        this.query =  this.query.find(JSON.parse(queryStr));
        return this;
    }
    sort() {
        if(this.queryString.sort) {
            // sort=price,ratingsAverage
            const sortBy = req.query.sort.split(',').join(' '); // replace the comma with a space
            this.query = this.query.sort(sortBy);  
        } 
        return this;
    }
    limitFields() {
        if(queryString.fields) { 
            // query = query.select('name duration price'); // this way of selecting the fields is called projecting
            const fields = req.query.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        }else {
            this.query = this.query.select('-__v'); // exclude the __v field
        }
        return this;
    }
    paginate()  {
        const page = req.query.page * 1 || 1; // convert the string to a number
        const limit = req.query.limit * 1 || 10;
        const skip = (page -1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this; 
    }

}

exports.getAllTour = async  (req, res) => {
    try {
    // BUILD QUERY
    // 1A) Filtering
    
    // const queryObj = {...req.query}; // make a copy of the query object
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // excludedFields.forEach(field => delete queryObj[field]); // delete the fields from the query object
    // // 1B) Advanced Filtering
    // let queryStr = JSON.stringify(queryObj);
    // queryStr =   queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`); // replace the operators with the dollar sign
    
    //   let query = Tour.find(JSON.parse(queryStr)); // find the tours that match the query object

    // 2) Sorting
    // if(req.query.sort) {
    //     // sort=price,ratingsAverage
    //     const sortBy = req.query.sort.split(',').join(' '); // replace the comma with a space
    //     query = query.sort(sortBy);  
    // }  else {
    //     query = query.sort('-createdAt'); // sort by newest first
    // }
    // 3) Field Limiting  // allows the user to select the fields they want to see
    // if(req.query.fields) { 
    //     // query = query.select('name duration price'); // this way of selecting the fields is called projecting
    //     const fields = req.query.fields.split(',').join(' ');
    //     query = query.select(fields);
    // }else {
    //     query = query.select('-__v'); // exclude the __v field
    // }

    //* 4)  Pagination
    // page=2&limit=3 ---> page 1 = page 1-3, page 2 = page 4-6, page 3 = page 7-9
    // query = query.skip(2).limit(3); // skip the first 2 results and limit the results to 10
        // const page = req.query.page * 1 || 1; // convert the string to a number
        // const limit = req.query.limit * 1 || 10;
        // const skip = (page -1) * limit;
        // query = query.skip(skip).limit(limit);
        // if(req.query.page) { 
        //     const numTours = await Tour.countDocuments(); // count the number of documents in the collection
        //     if(skip >= numTours) throw new Error('This page does not exist'); // if the skip is greater than the number of documents, throw an error
        // }
     
    // EXECUTE QUERY
    const feature = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
    const tours = await features.query;
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