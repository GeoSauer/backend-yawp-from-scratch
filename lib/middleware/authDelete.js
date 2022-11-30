const Review = require('../models/Review.js');

module.exports = async (req, res, next) => {
  try {
    const review = await Review.getById(req.params.id);
    if (
      req.user &&
      (req.user.id === review.userId || req.user.email === 'admin')
    ) {
      next();
    } else {
      throw new Error('You do not have access to view this page');
    }
  } catch (error) {
    error.status = 403;
    next(error);
  }
};
