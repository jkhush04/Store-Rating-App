const {validationResult} = require('express-validator');
const {pool}=require('../config/db');
const { ApiError } = require('../middleware/errorHandler');
const asyncHandler = require('../utils/asyncHandler');
 
const SORT_COLUMNS = ['name', 'address', 'avg_rating'];
 
function resolveSort(sortBy) {
  return SORT_COLUMNS.includes(sortBy) ? sortBy : 'name';
}
function resolveOrder(order) {
  return String(order).toLowerCase() === 'desc' ? 'DESC' : 'ASC';
}


const listStores = asyncHandler(async (req, res) => {
  const { name, address, sortBy, order } = req.query;
  const userId = req.user.id;
 
  const conditions = [];
  const params = [];
 
  if (name) { conditions.push('s.name LIKE ?'); params.push(`%${name}%`); }
  if (address) { conditions.push('s.address LIKE ?'); params.push(`%${address}%`); }
 
  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const sortColumn = resolveSort(sortBy);
  const sortOrder = resolveOrder(order);
 
  const [rows] = await pool.query(
    `SELECT
        s.id,
        s.name,
        s.address,
        COALESCE(AVG(r.rating), 0) AS avg_rating,
        ur.rating AS user_rating
     FROM stores s
     LEFT JOIN ratings r ON r.store_id = s.id
     LEFT JOIN ratings ur ON ur.store_id = s.id AND ur.user_id = ?
     ${whereClause}
     GROUP BY s.id, ur.rating
     ORDER BY ${sortColumn} ${sortOrder}`,
    [userId, ...params]
  );

    res.json({success: true, data: rows});
});

const submitRating = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, errors.array()[0].msg);
  }
 
  const storeId = req.params.id;
  const userId = req.user.id;
  const { rating } = req.body;
 
  const [storeRows] = await pool.query('SELECT id FROM stores WHERE id = ?', [storeId]);
  if (storeRows.length === 0) {
    throw new ApiError(404, 'Store not found');
  }
 
  await pool.query(
    `INSERT INTO ratings (user_id, store_id, rating)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE rating = VALUES(rating)`,
    [userId, storeId, rating]
  );
 
  res.json({ success: true, message: 'Rating saved' });
});
 
module.exports = { listStores, submitRating };
