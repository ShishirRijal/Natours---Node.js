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

    
// * ROUTES
// mount the router 

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);


 //* SERVER 
 const port = process.env.port || 8000;
 app.listen(port, (req, res) => {
        console.log(`Server is running on port ${port}`);
 })