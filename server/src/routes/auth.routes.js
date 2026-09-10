const express = require('express');

const router=express.Router();

const {signup, login, updatePassword}=require('../controllers/auth.controller');

const {signupValidation, loginValidation, updatePasswordValidation}=require('../validators/auth.validator');

const {requireAuth}=require('../middleware/auth.middleware');

router.post('/signup' ,signupValidation, signup);
 router.post('/login', loginValidation, login);
router.put('/update-password', requireAuth, updatePasswordValidation, updatePassword);
module.exports=router;
