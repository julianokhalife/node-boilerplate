const joi = require('joi');
joi.objectID = require('joi-objectid')(joi);

const postBody = {
  author: joi.string()
    .required(),
  content: joi.string()
    .required(),
  title: joi.string()
    .required()
};

const commonOptions = {
  allowUnknownBody: false,
  allowUnknownParams: false,
  allowUnknownQuery: false
};

const PostValidation = {
  getPostById: {
    options: commonOptions,
    params: {
      id: joi.objectID()
        .required()
    }
  },
  addPost: {
    options: commonOptions,
    body: postBody
  },
  updatePost: {
    options: commonOptions,
    params: {
      id: joi.objectID()
        .required()
    },
    body: postBody
  },
  deletePostById: {
    options: commonOptions,
    params: {
      id: joi.objectID()
        .required()
    }
  }
};

module.exports = PostValidation;
