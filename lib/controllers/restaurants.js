const { Router } = require('express');
const Restaurant = require('../models/Restaurant.js');

module.exports = Router()
  .get('/:id', async (req, res, next) => {
    try {
      const restaurant = await Restaurant.getById(req.params.id);
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
  });
