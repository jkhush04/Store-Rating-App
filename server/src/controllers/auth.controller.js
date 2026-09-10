const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { pool } = require('../config/db');
const ApiError = require('../middleware/errorHandler').ApiError;

const asyncHandler = require('../utils/asyncHandler');

const saltrounds = 10;

function signToken(user) {
    return jwt.sign({ id: user.id, role: user.role, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
}

const signup = asyncHandler(async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(400, errors.array()[0].msg);
    }

    const { name, email, address, password } = req.body;

    const [existing] = await pool.query('SELECT * FROM users WHERE email=?', [email]);

    if (existing.length > 0) {
        throw new ApiError(400, 'Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, saltrounds);


    const [result] = await pool.query(
        'INSERT INTO users (name, email, password_hash, address, role) VALUES (?, ?, ?, ?, ?)',
        [name, email, hashedPassword, address || null, 'user']
    );

    const user = { id: result.insertId, role: 'user', email };

    const token = signToken(user);

    res.status(201).json({
        success: true,
        data: {
            id: user.id,
            name, email, role: 'user'
        },
        token
    });
});

const login = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(400, errors.array()[0].msg);
    }
    const { email, password } = req.body;

    const [user] = await pool.query('SELECT * FROM users WHERE email=?', [email]);

    if (user.length === 0) {
        throw new ApiError(401, 'Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user[0].password_hash);
    if (!isMatch) {
        throw new ApiError(401, 'Invalid email or password');
    }

    const token = signToken(user[0]);

    res.json({
        success: true,
        data: {
            id: user[0].id,
            name: user[0].name,
            email: user[0].email,
            role: user[0].role
        },
        token
    });

});


const updatePassword = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw new ApiError(400, errors.array()[0].msg);
    }

    const { oldPassword, newPassword } = req.body;

    const [user] = await pool.query('SELECT * FROM users WHERE id=?', [req.user.id]);

    const isMatch = await bcrypt.compare(oldPassword, user[0].password_hash);
    if (!isMatch) {
        throw new ApiError(401, 'Old password is incorrect');
    }

    const newHashedPassword = await bcrypt.hash(newPassword, saltrounds);
    await pool.query('UPDATE users SET password_hash=? WHERE id=?', [newHashedPassword, req.user.id]);

    res.json({
        success: true,
        message: 'Password updated successfully'
    });
})

module.exports = {
    signup,
    login,
    updatePassword
};

