const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MarketplaceItem',
    required: [true, 'Item ID is required']
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Buyer ID is required']
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Seller ID is required']
  },
  originalPrice: {
    type: Number,
    required: [true, 'Original price is required'],
    min: [0, 'Price must be positive']
  },
  offerPrice: {
    type: Number,
    required: [true, 'Offer price is required'],
    min: [0, 'Price must be positive']
  },
  message: {
    type: String,
    maxlength: [500, 'Message cannot exceed 500 characters'],
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'counter-offered', 'cancelled'],
    default: 'pending'
  },
  counterOffer: {
    price: {
      type: Number,
      min: [0, 'Price must be positive']
    },
    message: {
      type: String,
      maxlength: [500, 'Message cannot exceed 500 characters'],
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  validUntil: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    }
  },
  history: [{
    action: {
      type: String,
      enum: ['created', 'accepted', 'rejected', 'counter-offered', 'cancelled']
    },
    message: String,
    price: Number,
    timestamp: {
      type: Date,
      default: Date.now
    },
    by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
offerSchema.index({ itemId: 1 });
offerSchema.index({ buyerId: 1 });
offerSchema.index({ sellerId: 1 });
offerSchema.index({ status: 1 });
offerSchema.index({ createdAt: -1 });

// Virtual for buyer info
offerSchema.virtual('buyer', {
  ref: 'User',
  localField: 'buyerId',
  foreignField: '_id',
  justOne: true
});

// Virtual for seller info
offerSchema.virtual('seller', {
  ref: 'User',
  localField: 'sellerId',
  foreignField: '_id',
  justOne: true
});

// Virtual for item info
offerSchema.virtual('item', {
  ref: 'MarketplaceItem',
  localField: 'itemId',
  foreignField: '_id',
  justOne: true
});

// Pre-save middleware to add to history
offerSchema.pre('save', function(next) {
  if (this.isNew) {
    this.history.push({
      action: 'created',
      message: this.message,
      price: this.offerPrice,
      by: this.buyerId
    });
  }
  next();
});

// Method to accept offer
offerSchema.methods.accept = function(sellerId) {
  this.status = 'accepted';
  this.history.push({
    action: 'accepted',
    timestamp: Date.now(),
    by: sellerId
  });
  return this.save();
};

// Method to reject offer
offerSchema.methods.reject = function(sellerId, message) {
  this.status = 'rejected';
  this.history.push({
    action: 'rejected',
    message: message,
    timestamp: Date.now(),
    by: sellerId
  });
  return this.save();
};

// Method to counter offer
offerSchema.methods.counter = function(sellerId, price, message) {
  this.status = 'counter-offered';
  this.counterOffer = {
    price: price,
    message: message,
    createdAt: Date.now()
  };
  this.history.push({
    action: 'counter-offered',
    message: message,
    price: price,
    timestamp: Date.now(),
    by: sellerId
  });
  return this.save();
};

// Method to cancel offer
offerSchema.methods.cancel = function(userId) {
  this.status = 'cancelled';
  this.history.push({
    action: 'cancelled',
    timestamp: Date.now(),
    by: userId
  });
  return this.save();
};

module.exports = mongoose.model('Offer', offerSchema);
