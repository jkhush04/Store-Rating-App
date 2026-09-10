const express=require('express');
const router=express.Router();

const {getDashboard}=require('../controllers/owner.controller');
const {requireAuth, requireRole}=require('../middleware/auth.middleware');

router.use(requireAuth, requireRole('owner'));

router.get('/dashboard',getDashboard);


module.exports=router;