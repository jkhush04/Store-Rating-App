const { validationResult } = require('express-validator');
const { ApiError } = require('../middleware/errorHandler');
const asyncHandler = require('../utils/asyncHandler');
const { pool } = require('../config/db');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const USER_SORT_COLUMNS = ['name', 'email', 'address', 'role', 'created_at'];
const STORE_SORT_COLUMNS = ['name', 'email', 'address', 'avg_rating', 'created_at'];
 
function resolveSort(sortBy, allowedColumns, fallback) {
  const column = allowedColumns.includes(sortBy) ? sortBy : fallback;
  return column;
}
 
function resolveOrder(order) {
  return String(order).toLowerCase() === 'desc' ? 'DESC' : 'ASC';
}



const getDashboardStats = asyncHandler(async (req, res) => {
  const [[{ totalUsers }]] = await pool.query('SELECT COUNT(*) AS totalUsers FROM users');
  const [[{ totalStores }]] = await pool.query('SELECT COUNT(*) AS totalStores FROM stores');
  const [[{ totalRatings }]] = await pool.query('SELECT COUNT(*) AS totalRatings FROM ratings');
 
  res.json({
    success: true,
    data: { totalUsers, totalStores, totalRatings }
  });
});

const createUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, errors.array()[0].msg);
  }
 
  const { name, email, address, password, role } = req.body;
 
  const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  if (existing.length > 0) {
    throw new ApiError(409, 'An account with this email already exists');
  }
 
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
 
  const [result] = await pool.query(
    'INSERT INTO users (name, email, password_hash, address, role) VALUES (?, ?, ?, ?, ?)',
    [name, email, passwordHash, address || null, role]
  );
 
  res.status(201).json({
    success: true,
    data: { id: result.insertId, name, email, address: address || null, role }
  });
});



const createStore = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, errors.array()[0].msg);
  }
 
  const { name, email, address, owner_id } = req.body;
 
  if (owner_id) {
    const [ownerRows] = await pool.query(
      "SELECT id FROM users WHERE id = ? AND role = 'owner'",
      [owner_id]
    );
    if (ownerRows.length === 0) {
      throw new ApiError(400, 'owner_id must reference an existing user with role owner');
    }
  }
 
  const [result] = await pool.query(
    'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
    [name, email, address || null, owner_id || null]
  );
 
  res.status(201).json({
    success: true,
    data: { id: result.insertId, name, email, address: address || null, owner_id: owner_id || null }
  });
});



const listUsers = asyncHandler(async (req, res) => {
  const { name, email, address, role, sortBy, order } = req.query;
 
  const conditions = [];
  const params = [];
 
  if (name) { conditions.push('name LIKE ?'); params.push(`%${name}%`); }
  if (email) { conditions.push('email LIKE ?'); params.push(`%${email}%`); }
  if (address) { conditions.push('address LIKE ?'); params.push(`%${address}%`); }
  if (role) { conditions.push('role = ?'); params.push(role); }
 
  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const sortColumn = resolveSort(sortBy, USER_SORT_COLUMNS, 'name');
  const sortOrder = resolveOrder(order);
 
  const [rows] = await pool.query(
    `SELECT id, name, email, address, role, created_at
     FROM users
     ${whereClause}
     ORDER BY ${sortColumn} ${sortOrder}`,
    params
  );

    res.json({ success: true, data: rows });

});


const listStores = asyncHandler(async (req, res) => {
  const { name, email, address, sortBy, order } = req.query;
 
  const conditions = [];
  const params = [];
 
  if (name) { conditions.push('s.name LIKE ?'); params.push(`%${name}%`); }
  if (email) { conditions.push('s.email LIKE ?'); params.push(`%${email}%`); }
  if (address) { conditions.push('s.address LIKE ?'); params.push(`%${address}%`); }
 
  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const sortColumn = resolveSort(sortBy, STORE_SORT_COLUMNS, 'name');
  const sortOrder = resolveOrder(order);
 
  const [rows] = await pool.query(
    `SELECT s.id, s.name, s.email, s.address,
            COALESCE(AVG(r.rating), 0) AS avg_rating
     FROM stores s
     LEFT JOIN ratings r ON r.store_id = s.id
     ${whereClause}
     GROUP BY s.id
     ORDER BY ${sortColumn} ${sortOrder}`,
    params
  );
 
  res.json({ success: true, data: rows });
});
 

const getUserDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
 
  const [rows] = await pool.query(
    'SELECT id, name, email, address, role, created_at FROM users WHERE id = ?',
    [id]
  );
  if (rows.length === 0) {
    throw new ApiError(404, 'User not found');
  }
 
  const user = rows[0];
 
  if (user.role === 'owner') {
    const [[ratingRow]] = await pool.query(
      `SELECT COALESCE(AVG(r.rating), 0) AS avg_rating
       FROM stores s
       LEFT JOIN ratings r ON r.store_id = s.id
       WHERE s.owner_id = ?`,
      [id]
    );
    user.rating = ratingRow.avg_rating;
  }
 
  res.json({ success: true, data: user });
});



module.exports = {
  createUser,
  createStore,
  getUserDetails,
  getDashboardStats,
  listUsers,
  listStores
};
