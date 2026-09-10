const express =require('express');
const router=express.Router();

const {
  getDashboardStats,
  createUser,
  createStore,
  listUsers,
  listStores,
  getUserDetails
}=require('../controllers/admin.controller');


const {createUserValidation, createStoreValidation}=require('../validators/admin.validator');   

const {requireAuth, requireRole}=require('../middleware/auth.middleware');

router.use(requireAuth,requireRole('admin'));

router.get('/dashboard', getDashboardStats);
router.post('/users', createUserValidation, createUser);
router.post('/stores', createStoreValidation, createStore);
router.get('/users', listUsers);
router.get('/stores', listStores);
router.get('/users/:id', getUserDetails);

module.exports=router;

