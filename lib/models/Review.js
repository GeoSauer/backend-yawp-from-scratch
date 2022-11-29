const pool = require('../utils/pool');

module.exports = class Review {
  id;
  user_id;
  stars;
  detail;

  constructor(row) {
    this.id = row.id;
    this.userId = row.user_id;
    this.stars = row.stars;
    this.detail = row.detail;
  }

  static async insert({ restaurantId, userId, stars, detail }) {
    const { rows } = await pool.query(
      `
    INSERT INTO reviews (restaurant_id, user_id, stars, detail)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
      [restaurantId, userId, stars, detail]
    );
    return new Review(rows[0]);
  }
};
