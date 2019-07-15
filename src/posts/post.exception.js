const HttpException = require('../exceptions/httpException');

class PostNotFoundException extends HttpException {
  constructor(id) {
    super(404, `Post with id ${id} not found`);
  }
}

module.exports = { PostNotFoundException };
