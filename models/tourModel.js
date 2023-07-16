const mongoose = require('mongoose');
const slugify = require('slugify');


const tourSchema = new mongoose.Schema({
       name: {
              type: String,
              required:  [true, 'A tour must have a name'],
              unique: [true, 'A tour already exists by this name']
       }, 
       slug: String,
       duration: {
              type: Number, 
              required: [true, 'A tour must have a duration']
       }, 
       maxGroupSize: {
              type: Number, 
              required: [true, 'A tour must have a group size']
       },
       difficulty: {
              type: String,
              required: [true, 'A tour must have a difficulty']
       }, 
       ratingsAverage: {
              type: Number,
              default: 4.5
       }, 
       ratingsQuantity: { 
              type: Number,
              default: 0
       },
       price: {
              type: Number,
              required: [true, 'A tour must have a price']
       }, 
       priceDiscount: { 
              type: Number,
              default: 0
       },
       summary: {
                     type: String,
                     trim: true,
                     required: [true, 'A tour must have a summary']
       }, 
       description: {
              type: String,
              trim: true,
              required: [true, 'A tour must have a description']
       }, 
       imageCover: {
              type: String,
              required: [true, 'A tour must have a cover image']
       },
       images: [String],
       createdAt: {
              type: Date,
              default: Date.now(), 
              select: false // this field will not be displayed when a tour is fetched
       },
       startDates: [Date], 
       secretTour: {
              type: Boolean,
              default: false
       },
}, {
       toJSON: { virtuals: true}, // when data is outputted as JSON, include the virtual properties
       toObject: { virtuals: true} // when data is outputted as an object, include the virtual properties
});

// Virtual Properties: properties that are not stored in the database but are computed using some other value
tourSchema.virtual('durationWeeks').get(function() {
       return this.duration / 7;
}); 



//* MONGOOSE MI  DDLEWARE 
// There are 4 types of middleware in mongoose: document, query, aggregate, and model middleware

// 1) DOCUMENT MIDDLEWARE: runs before .save() and .create() but not .insertMany()
// this refers to the current document
tourSchema.pre('save', function(next) {
       this.slug = slugify(this.name, { lower: true }); 
       next();
});

// tourSchema.post('save', function(doc, next) {
//        console.log(doc);
//        next();
// })

// 2) QUERY MIDDLEWARE: runs before .find() and .findOne()
// this refers to the current query
tourSchema.pre(/^find/, function(next) {

       this.find({secretTour: {$ne: true }});
       this.start = Date.now();
       next();
});

// runs after the query has executed
tourSchema.post(/^find/, function(docs, next) { // docs is the result of the query
       console.log(`Query took ${Date.now() - this.start} milliseconds`);
       console.log(docs);

       next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;