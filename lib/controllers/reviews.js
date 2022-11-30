const { Router } = require('express');
const authDelete = require('../middleware/authDelete');
const authenticate = require('../middleware/authenticate');
const Review = require('../models/Review.js');

module.exports = Router()
  .get('/:id', authenticate, async (req, res, next) => {
    try {
      const review = await Review.getById(req.params.id);
      if (!review) {
        next();
      }
      res.json(review);
    } catch (error) {
      next(error);
    }
  })
  .delete('/:id', [authenticate, authDelete], async (req, res, next) => {
    try {
      const deletedReview = await Review.deleteById(req.params.id);
      res.json(deletedReview);
    } catch (error) {
      next(error);
    }
  });
