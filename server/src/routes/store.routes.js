const express=require('express');
const router=express.Router();

const{listStores, submitRating}=require('../controllers/store.controller');
const {submitRatingValidation}=require('../validators/store.validator');
const {requireAuth, requireRole}=require('../middleware/auth.middleware');

router.use(requireAuth, requireRole('user'));

router.get('/',listStores);
router.post('/:id/rating',submitRatingValidation, submitRating);

module.exports=router;