const Product = require('../models/Product');

// @desc    Fetch all products with search & category filter
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { keyword, category } = req.query;
    const filter = {};
    if (keyword) {
      filter.name = { $regex: keyword, $options: 'i' };
    }
    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }
    filter.image = { $exists: true, $nin: [null, ''] };
    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get search suggestions (names only)
// @route   GET /api/products/suggestions?keyword=xxx
// @access  Public
const getProductSuggestions = async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) return res.json([]);
    const products = await Product.find(
      { name: { $regex: keyword, $options: 'i' }, image: { $exists: true, $nin: [null, ''] } },
      { name: 1, category: 1, image: 1, price: 1 }
    ).limit(6);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product && product.image) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getProducts, getProductById, getProductSuggestions };
