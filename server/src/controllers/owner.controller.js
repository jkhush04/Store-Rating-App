const { pool } = require('../config/db');
const { ApiError } = require('../middleware/errorHandler');
const asyncHandler = require('../utils/asyncHandler');




const getDashboard = asyncHandler(async (req, res) => {
    const ownerId = req.user.id;

    const [storeRows] = await pool.query('SELECT id FROM stores WHERE owner_id = ?', [ownerId]);
    if (storeRows.length === 0) {
        throw new ApiError(404, 'No Store is assigned to this account yet');

    }

    const store = storeRows[0];

    const [[{ avg_rating }]] = await pool.query('SELECT COALESCE(AVG(rating),0) AS avg_rating FROM ratings WHERE store_id = ?', [store.id]);


    const [raters] = await pool.query(
        `SELECT u.id AS user_id, u.name, u.email, r.rating, r.updated_at
     FROM ratings r
     JOIN users u ON u.id = r.user_id
     WHERE r.store_id = ?
     ORDER BY r.updated_at DESC`,
        [store.id]
    );

    res.json({
        success: true,
        data: {
            store: {
                id: store.id,
                name: store.name,
                address: store.address,

            },
            avg_rating,
            raters
        }

    });
});

module.exports = { getDashboard };