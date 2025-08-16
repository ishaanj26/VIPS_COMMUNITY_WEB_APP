const express = require('express');
const router = express.Router();
const {
  addItem,
  getItems,
  getItemById,
  markItemSold,
  deleteItem,
  getUserItems,
  getCategories
} = require('../controllers/marketplaceController');

// Middleware for authentication (optional - implement based on your auth system)
const authenticateUser = (req, res, next) => {
  // For now, we'll extract sellerId from request body
  // In production, implement proper JWT authentication
  next();
};

// Public routes
router.get('/items', getItems);
router.get('/item/:id', getItemById);
router.get('/categories', getCategories);

// Protected routes (require authentication)
router.post('/add-item', authenticateUser, addItem);
router.put('/item/:id/mark-sold', authenticateUser, markItemSold);
router.delete('/item/:id', authenticateUser, deleteItem);
router.get('/user/:userId/items', authenticateUser, getUserItems);

module.exports = router;
