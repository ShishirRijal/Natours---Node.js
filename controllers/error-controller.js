const AppError = require('../utils/app-error');

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`; 
    return new AppError(message, 400); // 400 = bad request
}

const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]; // regex to get the value of the duplicate field
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
} 


const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status, 
        error: err, 
        message: err.message,
        stack: err.stack,
     });
}

const sendErrorProd = (err, res) => { 
    // Operational, trusted error: send message to client
    if(err.isOperational) { 
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message, 
        }); 
    }
    // Programming or other unknown error: don't leak error details
    else {
        // 1) Log error -- for devs so we can see what's going on
        console.error('ERROR 🔥: ', err); 

        // 2) Send generic message -- for users
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong!',
        });
    }
    
}

module.exports =  (err, req, res, next) => {
    // let's show different errors depending on the environment
    err.statusCode = err.statusCode || 500; 
    err.status = err.status || 'error';

    // in development mode, we want to show as much information as possible
    if(process.env.NODE_ENV === 'development') { 
      sendErrorDev(err, res);
    }
    // in production mode, we want to show a more generic error message
    else if(process.env.NODE_ENV === 'production') {
        let error = {...err}; 
        // * handling the cast error
        if(err.name === 'CastError')  error = handleCastErrorDB(error);
        // * handling the duplicate fields error
        if (error.code === 11000) error = handleDuplicateFieldsDB(err);
        sendErrorProd(error, res);
    }
}


  