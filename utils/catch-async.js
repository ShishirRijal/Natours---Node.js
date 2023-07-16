
/* 
    The purpose of the catchAsync function is to wrap an asynchronous function 
    and handle any errors that may occur during its execution. 
    It ensures that errors are caught and passed to the Express.js error handling middleware 
    for appropriate handling and response.
*/
module.exports = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
        // The .catch() method is then chained to the returned promise from fn. 
        // If fn throws an error or the promise is rejected, the .catch() method catches the error.
        // this catch method will pass the error to the next function
        // which will then make it so that our  error ends up in 
        // global error handling middleware
    }
} 