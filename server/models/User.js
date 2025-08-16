const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    verifyOtp: {
        type: String,
        default: ''
    },
    verifyOtpExpireAt: {
        type: Number,
        default: 0
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    },
     // Profile fields
    bio: { type: String, default: '' },
    skills: { type: [String], default: [] }, // array of skills
    interests: { type: [String], default: [] },
    profilePicture: { type: String, default: '' }, // image URL
    coverPicture: { type: String, default: '' },
    courseTitle: { type: String, default: '' },
    title: { type: String, default: '' },
    socialLinks: {
        github: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        twitter: { type: String, default: '' }
    },
    // Marketplace related fields
    likedItems: [{
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MarketplaceItem'
        },
        likedAt: {
            type: Date,
            default: Date.now
        }
    }],
    likedComments: [{
        commentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        },
        likedAt: {
            type: Date,
            default: Date.now
        }
    }]
});

module.exports = mongoose.model('User', userSchema);
