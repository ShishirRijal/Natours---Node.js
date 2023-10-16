const express = require('express');
const fs = require('fs');
const morgan = require('morgan'); 
const AppError = require(`${__dirname}/utils/app-error.js`);
const globalErrorHandler = require(`${__dirname}/controllers/error-controller.js`);
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');


// import routes
const tourRouter = require(`${__dirname}/routes/tour-routes.js`); 
const userRouter = require(`${__dirname}/routes/user-routes.js`); 
const reviewRouter = require(`${__dirname}/routes/review-routes.js`) 



 
const app = express(); 

 



//*  MIDDLEWARES -- called so because it sits between the request and the response
// it can modify the incoming request data

const limiter = rateLimit({
    max: 100, // max number of requests from an IP
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many requests from this IP, please try again in an hour',
});

app.use('/api', limiter); // apply the limiter middleware to all the routes that start with /api 
app.use(helmet()); // set security HTTP headers
// Body parser, reading data from the body into req.body
app.use(express.json({
    limit: '10kb' // limit the size of the request body to 10kb
}));  // the data from the body is added to the request object

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xssClean());
// Prevent parameter pollution
app.use(hpp({
    // whitelist allows duplicate parameters in the query string
    whitelist: ['duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price']
}));

app.use(morgan('dev')); //  morgan is a logging middleware that logs the request data to the console
app.use(express.static(`${__dirname}/public`)); // access the static files
   

app.use((req, res, next) => {
    console.log(req.headers); 
    next();  
});
// * ROUTES
// mount the router 

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);



// if we make upto here, this is an undefined route
app.all('*', (req, res, next) => {
    // const err = new Error(`Can't find ${req.originalUrl} on this server`);
    // err.statusCode = 404;
    // err.status = 'Failure'; 
    // if we pass anything to the next function, express will assume that it is an error and will skip all the middlewares and go straight to the error handling middleware
    // next(err); // passing the error to the next middleware

    // using custom error class, we can do this
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));

})


// Error handling middleware
// giving 4 parameters to the middleware tells express that this is an error handling middleware
app.use(globalErrorHandler); 



module.exports = app;