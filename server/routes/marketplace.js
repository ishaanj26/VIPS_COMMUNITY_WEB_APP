const express = require('express');
const router = express.Router();
const {
  addItem,
  getItems,
  getItemById,
  incrementItemView,
  markItemSold,
  deleteItem,
  getUserItems,
  getCategories,
  createOffer,
  getItemOffers,
  getUserOffers,
  respondToOffer,
  addComment,
  getItemComments,
  toggleCommentLike,
  deleteComment,
  getTrendingTags,
  getMarketplaceStats
} = require('../controllers/marketplaceController');

// Middleware for authentication (optional - implement based on your auth system)
const authenticateUser = (req, res, next) => {
  // For now, we'll extract userId from request body or params
  // In production, implement proper JWT authentication
  next();
};

// PUBLIC ROUTES
router.get('/items', getItems);
router.get('/item/:id', getItemById);
router.patch('/item/:id/view', incrementItemView);
router.get('/categories', getCategories);
router.get('/trending-tags', getTrendingTags);
router.get('/stats', getMarketplaceStats);

// ITEM MANAGEMENT ROUTES (require authentication)
router.post('/add-item', authenticateUser, addItem);
router.put('/item/:id/mark-sold', authenticateUser, markItemSold);
router.delete('/item/:id', authenticateUser, deleteItem);
router.get('/user/:userId/items', authenticateUser, getUserItems);

// OFFER MANAGEMENT ROUTES
router.post('/offers', authenticateUser, createOffer);
router.get('/item/:itemId/offers', authenticateUser, getItemOffers);
router.get('/user/:userId/offers', authenticateUser, getUserOffers);
router.put('/offer/:offerId/respond', authenticateUser, respondToOffer);

// COMMENT MANAGEMENT ROUTES
router.post('/comments', authenticateUser, addComment);
router.get('/item/:itemId/comments', getItemComments);
router.put('/comment/:commentId/like', authenticateUser, toggleCommentLike);
router.delete('/comment/:commentId', authenticateUser, deleteComment);

module.exports = router;
