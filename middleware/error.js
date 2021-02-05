const ErrorResponse = require("../util/errorResponse");
const errorHandler = (err, req, res, next) => {
    let error = {...err};
    error.message = err.message;
    //Log to console for dev
    console.log(err);
    // Mongoose duplicate keey
    if(err.code === 11000)
    {
        const message = 'Duplicate field value entered';
        error = new ErrorResponse(message, 400);

    }
    if(err.name === 'CastError')
    {
        const message= "invalid url entered";
        error = new ErrorResponse(message, 400);

    }
    //Mongoose validation error
    if(err.name === 'ValidationError')
    {
        const message = Object.values(err.errors).map( val => val.message);
        error = new ErrorResponse(message, 400);
    }
    
    res.status(error.statusCode || 500).json({
       success: false,
        error: error.message || 'Server Error'
    });

};
module.exports = errorHandler;