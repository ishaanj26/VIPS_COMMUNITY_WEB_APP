const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MarketplaceItem',
    required: [true, 'Item ID is required']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    trim: true,
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  parentCommentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  isQuestion: {
    type: Boolean,
    default: false
  },
  isAnswer: {
    type: Boolean,
    default: false
  },
  answeredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isSellerResponse: {
    type: Boolean,
    default: false
  },
  likes: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    likedAt: {
      type: Date,
      default: Date.now
    }
  }],
  likesCount: {
    type: Number,
    default: 0
  },
  reported: {
    isReported: {
      type: Boolean,
      default: false
    },
    reportedBy: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      reason: {
        type: String,
        enum: ['spam', 'inappropriate', 'harassment', 'false-info', 'other']
      },
      reportedAt: {
        type: Date,
        default: Date.now
      }
    }],
    reportCount: {
      type: Number,
      default: 0
    }
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editHistory: [{
    content: String,
    editedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for better query performance
commentSchema.index({ itemId: 1 });
commentSchema.index({ userId: 1 });
commentSchema.index({ parentCommentId: 1 });
commentSchema.index({ createdAt: -1 });
commentSchema.index({ isQuestion: 1 });
commentSchema.index({ isDeleted: 1 });

// Virtual for user info
commentSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

// Virtual for item info
commentSchema.virtual('item', {
  ref: 'MarketplaceItem',
  localField: 'itemId',
  foreignField: '_id',
  justOne: true
});

// Virtual for parent comment
commentSchema.virtual('parentComment', {
  ref: 'Comment',
  localField: 'parentCommentId',
  foreignField: '_id',
  justOne: true
});

// Virtual for replies
commentSchema.virtual('replies', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parentCommentId'
});

// Pre-save middleware
commentSchema.pre('save', function(next) {
  if (this.isDeleted && !this.deletedAt) {
    this.deletedAt = Date.now();
  }
  next();
});

// Method to add like
commentSchema.methods.addLike = function(userId) {
  const existingLike = this.likes.find(like => 
    like.userId.toString() === userId.toString()
  );
  
  if (!existingLike) {
    this.likes.push({ userId });
    this.likesCount += 1;
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to remove like
commentSchema.methods.removeLike = function(userId) {
  const likeIndex = this.likes.findIndex(like => 
    like.userId.toString() === userId.toString()
  );
  
  if (likeIndex > -1) {
    this.likes.splice(likeIndex, 1);
    this.likesCount = Math.max(0, this.likesCount - 1);
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to edit comment
commentSchema.methods.editContent = function(newContent) {
  if (this.content !== newContent) {
    this.editHistory.push({
      content: this.content,
      editedAt: Date.now()
    });
    this.content = newContent;
    this.isEdited = true;
  }
  return this.save();
};

// Method to report comment
commentSchema.methods.addReport = function(userId, reason) {
  const existingReport = this.reported.reportedBy.find(report => 
    report.userId.toString() === userId.toString()
  );
  
  if (!existingReport) {
    this.reported.reportedBy.push({ userId, reason });
    this.reported.reportCount += 1;
    this.reported.isReported = true;
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to soft delete
commentSchema.methods.softDelete = function() {
  this.isDeleted = true;
  this.deletedAt = Date.now();
  return this.save();
};

module.exports = mongoose.model('Comment', commentSchema);
