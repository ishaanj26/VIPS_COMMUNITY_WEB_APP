const express = require('express');
const router = express.Router();
const User = require('../models/User');
const MarketplaceItem = require('../models/MarketplaceItem');

// Get current user's profile
router.get('/profile', async (req, res) => {
    try {
        // Accept userId from query
        const userId = req.user?.id || req.query.userId;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        // Return all user data except password and sensitive fields
        const { password, verifyOtp, verifyOtpExpireAt, ...safeUser } = user.toObject();
        res.json(safeUser);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update current user's profile
router.put('/edit-profile', async (req, res) => {
    console.log('Updating profile with data:', req.body);
    try {
        const userId = req.body.id;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });
        const { bio, skills, interests, courseTitle, title } = req.body;
        const user = await User.findByIdAndUpdate(
            userId,
            { bio, skills, interests, courseTitle, title },
            { new: true }
        );
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user's liked items
router.get('/liked-items', async (req, res) => {
    try {
        const userId = req.user?.id || req.query.userId;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });
        
        const user = await User.findById(userId).populate({
            path: 'likedItems.itemId',
            model: 'MarketplaceItem',
            select: 'title price images category createdAt isSold sellerId sellerName'
        });
        
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        // Filter out any null items (in case items were deleted)
        const likedItems = user.likedItems
            .filter(like => like.itemId)
            .map(like => ({
                ...like.itemId.toObject(),
                likedAt: like.likedAt
            }));
        
        res.json({
            success: true,
            likedItems
        });
    } catch (err) {
        console.error('Error fetching liked items:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Like/Unlike an item
router.post('/toggle-item-like', async (req, res) => {
    try {
        const { itemId } = req.body;
        const userId = req.user?.id || req.body.userId;
        
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });
        
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        const existingLike = user.likedItems.find(like => 
            like.itemId.toString() === itemId
        );
        
        if (existingLike) {
            // Unlike - remove from array
            user.likedItems = user.likedItems.filter(like => 
                like.itemId.toString() !== itemId
            );
        } else {
            // Like - add to array
            user.likedItems.push({ itemId });
        }
        
        await user.save();
        
        res.json({
            success: true,
            isLiked: !existingLike
        });
    } catch (err) {
        console.error('Error toggling item like:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
