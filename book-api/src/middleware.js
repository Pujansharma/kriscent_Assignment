// src/middleware.js
const requestLogger = (req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} - ${req.url}`);
    next();
  };
  
  const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  };
  
  module.exports = { requestLogger, errorHandler };
  