const { Router } = require('express');
const authenticate = require('../middleware/authenticate.js');
const Restaurant = require('../models/Restaurant.js');
const Review = require('../models/Review.js');

module.exports = Router()
  .get('/:restId', async (req, res, next) => {
    try {
      const restaurant = await Restaurant.getById(req.params.restId);
      await restaurant.addReviews();
      if (!restaurant) {
        next();
      }
      res.json(restaurant);
    } catch (error) {
      next(error);
    }
  })
  .get('/', async (req, res, next) => {
    try {
      const restaurants = await Restaurant.getAll();
      res.json(restaurants);
    } catch (error) {
      next(error);
    }
  })
  .post('/:restId/reviews', authenticate, async (req, res, next) => {
    try {
      const review = await Review.insert({
        restaurantId: req.params.id,
        userId: req.user.id,
        stars: req.body.stars,
        detail: req.body.detail,
      });
      res.json(review);
    } catch (error) {
      next(error);
    }
  });
