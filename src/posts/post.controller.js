const express = require('express');
const validate = require('express-validation');
const expressGraphQL = require('express-graphql');
const { buildSchema } = require('graphql');
const { PostNotFoundException } = require('./post.exception');
const HttpException = require('../exceptions/httpException');
const PostValidation = require('./post.validation');
const Post = require('./post.model');

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const root = { hello: () => 'Hello world!' };

class Controller {
  constructor() {
    this.path = '/posts';
    this.graphPath = '/posts-graphql';
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(this.path, Controller.getAllPosts);
    this.router.get(`${this.path}/:id`, validate(PostValidation.getPostById), Controller.getPostById);
    this.router.put(`${this.path}/:id`, validate(PostValidation.updatePost), Controller.modifyPost);
    this.router.delete(`${this.path}/:id`, validate(PostValidation.deletePostById), Controller.deletePost);
    this.router.post(this.path, validate(PostValidation.addPost), Controller.createPost);

    this.router.use(this.graphPath, expressGraphQL({
      schema,
      rootValue: root,
      graphiql: true
    }));
  }

  static async getAllPosts(req, res, next) {
    try {
      const posts = await Post.find({});
      res.send(posts);
    } catch (e) {
      next(new HttpException(500, e.message));
    }
  }

  static async getPostById(req, res, next) {
    try {
      const { id } = req.params;
      const post = await Post.findById(id);
      if (post) {
        res.send(post);
      } else {
        next(new PostNotFoundException(id));
      }
    } catch (e) {
      next(new HttpException(500, e.message));
    }
  }

  static async modifyPost(req, res, next) {
    try {
      const { id } = req.params;
      const post = await Post.findByIdAndUpdate(id, req.body, { new: true });
      if (post) {
        res.send(post);
      } else {
        next(new PostNotFoundException(id));
      }
    } catch (e) {
      next(new HttpException(500, e.message));
    }
  }

  static async createPost(req, res, next) {
    try {
      const newPost = new Post(req.body);
      const savedPost = await newPost.save();
      res.send(savedPost);
    } catch (e) {
      next(new HttpException(500, e.message));
    }
  }

  static async deletePost(req, res, next) {
    try {
      const { id } = req.params;
      const successResponse = await Post.findByIdAndDelete(id);
      if (successResponse) {
        res.end();
      } else {
        next(new PostNotFoundException(id));
      }
    } catch (e) {
      next(new HttpException(500, e.message));
    }
  }
}

module.exports = Controller;
