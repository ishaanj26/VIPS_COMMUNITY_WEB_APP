const mongoose = require('mongoose');

const marketplaceItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be positive']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['electronics', 'books', 'clothing', 'furniture', 'sports', 'vehicles', 'other'],
      message: 'Invalid category'
    }
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [20, 'Tag cannot exceed 20 characters']
  }],
  location: {
    campus: {
      type: String,
      default: 'Main Campus'
    },
    hostel: {
      type: String,
      default: ''
    },
    block: {
      type: String,
      default: ''
    },
    room: {
      type: String,
      default: ''
    }
  },
  images: [{
    url: {
      type: String,
      validate: {
        validator: function(url) {
          return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(url);
        },
        message: 'Invalid image URL format'
      }
    },
    caption: {
      type: String,
      maxlength: [100, 'Caption cannot exceed 100 characters']
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  videos: [{
    url: {
      type: String,
      validate: {
        validator: function(url) {
          return /^https?:\/\/.+\.(mp4|avi|mov|wmv|webm)$/i.test(url);
        },
        message: 'Invalid video URL format'
      }
    },
    caption: {
      type: String,
      maxlength: [100, 'Caption cannot exceed 100 characters']
    },
    duration: {
      type: Number, // in seconds
      max: [300, 'Video cannot exceed 5 minutes']
    }
  }],
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Seller ID is required']
  },
  sellerName: {
    type: String,
    required: true
  },
  sellerEmail: {
    type: String,
    required: true
  },
  sellerVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isSold: {
    type: Boolean,
    default: false
  },
  soldAt: {
    type: Date
  },
  soldTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  views: {
    type: Number,
    default: 0
  },
  viewedBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }],
  featured: {
    type: Boolean,
    default: false
  },
  condition: {
    type: String,
    enum: ['new', 'like-new', 'good', 'fair', 'poor'],
    default: 'good'
  },
  negotiable: {
    type: Boolean,
    default: true
  },
  urgentSale: {
    type: Boolean,
    default: false
  },
  boost: {
    isActive: {
      type: Boolean,
      default: false
    },
    expiresAt: {
      type: Date
    }
  }
}, {
  timestamps: true
});

// Indexes for better search performance
marketplaceItemSchema.index({ title: 'text', description: 'text', tags: 'text' });
marketplaceItemSchema.index({ category: 1 });
marketplaceItemSchema.index({ 'location.campus': 1, 'location.hostel': 1 });
marketplaceItemSchema.index({ createdAt: -1 });
marketplaceItemSchema.index({ price: 1 });
marketplaceItemSchema.index({ views: -1 });
marketplaceItemSchema.index({ sellerId: 1 });
marketplaceItemSchema.index({ tags: 1 });
marketplaceItemSchema.index({ isSold: 1 });

// Virtual for seller info
marketplaceItemSchema.virtual('seller', {
  ref: 'User',
  localField: 'sellerId',
  foreignField: '_id',
  justOne: true
});

// Pre-save middleware to update updatedAt and handle sold items
marketplaceItemSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (this.isSold && !this.soldAt) {
    this.soldAt = Date.now();
  }
  next();
});

// Method to add view
marketplaceItemSchema.methods.addView = function(userId) {
  if (userId && userId.toString() !== this.sellerId.toString()) {
    // Check if user already viewed this item today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const alreadyViewedToday = this.viewedBy.some(view => 
      view.userId.toString() === userId.toString() && 
      view.viewedAt >= today
    );
    
    if (!alreadyViewedToday) {
      this.viewedBy.push({ userId, viewedAt: Date.now() });
      this.views += 1;
    }
  } else if (!userId) {
    // Anonymous view
    this.views += 1;
  }
  return this.save();
};

module.exports = mongoose.model('MarketplaceItem', marketplaceItemSchema);
