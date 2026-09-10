const {body} =require('express-validator');

const signupValidation=[
    body('name')
    .trim()
    .isLength({min:20, max:60})
    .withMessage('Name must be between 20 and 60 characters'),

    body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),

    body('password')
    .isLength({min:8, max:16})
    .withMessage('Password must be between 8 and 16 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one special character'),


    body('address')
    .optional({checkFalsy:true})
    .isLength({ max:400})
    .withMessage('Address must be atmost 400 characters')
];

const loginValidation=[
    body('email')
    .trim()
    .isEmail()
    .withMessage('A valid email is required'),

    body('password')
    .notEmpty()
    .withMessage('Password is required')
]

const updatePasswordValidation=[
    body('oldPassword')
    .notEmpty()
    .withMessage('Current password is required'),

    body('newPassword')
    .isLength({min:8, max:16})
    .withMessage('New password must be between 8 and 16 characters')
    .matches(/[A-Z]/)
    .withMessage('New password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('New password must contain at least one special character')
];

module.exports={
    signupValidation,
    loginValidation,
    updatePasswordValidation
};