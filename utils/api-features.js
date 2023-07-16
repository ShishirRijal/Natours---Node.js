
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


module.exports = APIFeatures; 