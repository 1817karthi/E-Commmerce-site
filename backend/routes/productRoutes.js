const express = require('express');
const router = express.Router();
const { getProducts, getProductById, getProductSuggestions } = require('../controllers/productController');

router.route('/').get(getProducts);
router.route('/suggestions').get(getProductSuggestions);
router.route('/:id').get(getProductById);

module.exports = router;
