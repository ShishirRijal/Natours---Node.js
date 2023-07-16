const express = require('express');
const fs = require('fs');
const morgan = require('morgan'); 

// import routes
const tourRouter = require(`${__dirname}/routes/tour-routes.js`); 
const userRouter = require(`${__dirname}/routes/user-routes.js`); 

 const app = express(); 

 
//*  MIDDLEWARES -- called so because it sits between the request and the response
// it can modify the incoming request data
app.use(express.json());  // the data from the body is added to the request object
app.use(morgan('dev')); //  morgan is a logging middleware that logs the request data to the console
app.use(express.static(`${__dirname}/public`)); // access the static files
    
// * ROUTES
// mount the router 

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);


// if we make upto here, this is an undefined route
app.all('*', (req, res, next) => {
    // res.status(404).json({
    //     status: 'failure', 
    //     message: `Can't find ${req.originalUrl} on this server`
    // });
    const err = new Error(`Can't find ${req.originalUrl} on this server`);
    err.statusCode = 404;
    err.status = 'Failure';
    // if we pass anything to the next function, express will assume that it is an error and will skip all the middlewares and go straight to the error handling middleware
    next(err); // passing the error to the next middleware
})


// Error handling middleware
// giving 4 parameters to the middleware tells express that this is an error handling middleware
app.use((err, req, res, next) => {
     err.statusCode = err.statusCode || 500; 
     err.status = err.status || 'error';
     res.status(err.statusCode).json({
        status: err.status, 
        message: err.message,
     })

})



module.exports = app;