const express = require('express');
const router = express.Router();
const User = require('../models/User');

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

module.exports = router;
