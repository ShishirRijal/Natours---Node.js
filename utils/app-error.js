class AppError extends Error {
    constructor(message, statusCode) { 
        super(message); // this will call the constructor of the parent class
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'Failure' : 'Error';
        this.isOperational = true; // this will be used to check if the error is operational or not
       
        Error.captureStackTrace(this, this.constructor); // this will not include this constructor in the stack trace
    }
}

module.exports = AppError;