const { body } = require('express-validator');

const createUserValidation = [
  body('name')
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters'),

  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),

  body('address')
    .optional({ checkFalsy: true })
    .isLength({ max: 400 })
    .withMessage('Address must be at most 400 characters'),

  body('password')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be 8-16 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one special character'),

  body('role')
    .isIn(['admin', 'user', 'owner'])
    .withMessage('Role must be admin, user, or owner')
];

const createStoreValidation = [
  body('name').trim().isLength({ min: 1, max: 60 }).withMessage('Store name is required (max 60 chars)'),
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('address')
    .optional({ checkFalsy: true })
    .isLength({ max: 400 })
    .withMessage('Address must be at most 400 characters'),
  body('owner_id')
    .optional({ checkFalsy: true })
    .isInt()
    .withMessage('owner_id must be a valid user id')
];

module.exports = { createUserValidation, createStoreValidation };