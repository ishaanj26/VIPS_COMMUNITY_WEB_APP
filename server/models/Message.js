const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: String,
    required: true,
    index: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sender ID is required']
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Receiver ID is required']
  },
  senderName: {
    type: String,
    required: true
  },
  receiverName: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file', 'offer', 'item-inquiry'],
    default: 'text'
  },
  attachments: [{
    type: {
      type: String,
      enum: ['image', 'file']
    },
    url: {
      type: String,
      required: true
    },
    filename: {
      type: String,
      required: true
    },
    size: {
      type: Number // in bytes
    },
    mimeType: {
      type: String
    }
  }],
  relatedItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MarketplaceItem'
  },
  relatedOfferId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Offer'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  isDelivered: {
    type: Boolean,
    default: false
  },
  deliveredAt: {
    type: Date
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  },
  originalContent: {
    type: String
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date
  },
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1 });
messageSchema.index({ receiverId: 1 });
messageSchema.index({ isRead: 1 });
messageSchema.index({ relatedItemId: 1 });
messageSchema.index({ createdAt: -1 });

// Virtual for sender info
messageSchema.virtual('sender', {
  ref: 'User',
  localField: 'senderId',
  foreignField: '_id',
  justOne: true
});

// Virtual for receiver info
messageSchema.virtual('receiver', {
  ref: 'User',
  localField: 'receiverId',
  foreignField: '_id',
  justOne: true
});

// Virtual for related item
messageSchema.virtual('relatedItem', {
  ref: 'MarketplaceItem',
  localField: 'relatedItemId',
  foreignField: '_id',
  justOne: true
});

// Virtual for related offer
messageSchema.virtual('relatedOffer', {
  ref: 'Offer',
  localField: 'relatedOfferId',
  foreignField: '_id',
  justOne: true
});

// Virtual for reply message
messageSchema.virtual('replyToMessage', {
  ref: 'Message',
  localField: 'replyTo',
  foreignField: '_id',
  justOne: true
});

// Static method to generate conversation ID
messageSchema.statics.generateConversationId = function(userId1, userId2) {
  const sortedIds = [userId1.toString(), userId2.toString()].sort();
  return `${sortedIds[0]}_${sortedIds[1]}`;
};

// Static method to get conversation messages
messageSchema.statics.getConversation = function(userId1, userId2, page = 1, limit = 50) {
  const conversationId = this.generateConversationId(userId1, userId2);
  return this.find({ 
    conversationId,
    isDeleted: false 
  })
  .sort({ createdAt: -1 })
  .limit(limit)
  .skip((page - 1) * limit)
  .populate('sender', 'name email profilePicture')
  .populate('receiver', 'name email profilePicture')
  .populate('relatedItem', 'title price images')
  .populate('relatedOffer', 'offerPrice status')
  .populate('replyToMessage', 'content senderName createdAt');
};

// Pre-save middleware
messageSchema.pre('save', function(next) {
  if (this.isDeleted && !this.deletedAt) {
    this.deletedAt = Date.now();
  }
  if (this.isRead && !this.readAt) {
    this.readAt = Date.now();
  }
  if (this.isDelivered && !this.deliveredAt) {
    this.deliveredAt = Date.now();
  }
  next();
});

// Method to mark as read
messageSchema.methods.markAsRead = function() {
  if (!this.isRead) {
    this.isRead = true;
    this.readAt = Date.now();
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to mark as delivered
messageSchema.methods.markAsDelivered = function() {
  if (!this.isDelivered) {
    this.isDelivered = true;
    this.deliveredAt = Date.now();
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to edit message
messageSchema.methods.editContent = function(newContent) {
  if (this.content !== newContent) {
    this.originalContent = this.content;
    this.content = newContent;
    this.isEdited = true;
    this.editedAt = Date.now();
  }
  return this.save();
};

// Method to soft delete
messageSchema.methods.softDelete = function(userId) {
  this.isDeleted = true;
  this.deletedAt = Date.now();
  this.deletedBy = userId;
  return this.save();
};

module.exports = mongoose.model('Message', messageSchema);
