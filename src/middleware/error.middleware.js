function errorMiddleware(error, req, res, next) {
  if (error && error.message === 'validation error') {
    res.status(400).json(error.errors);
  } else {
    const status = error.status || 500;
    const responseBody = {
      message: error.message || 'Something went wrong',
    };
    res.status(status).send(responseBody);
  }
}

module.exports = errorMiddleware;
