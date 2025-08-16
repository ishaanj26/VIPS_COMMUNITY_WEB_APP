const MarketplaceItem = require('../models/MarketplaceItem');
const Offer = require('../models/Offer');
const Comment = require('../models/Comment');
const Message = require('../models/Message');
const User = require('../models/User');

// Add new item (enhanced)
const addItem = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      category,
      tags,
      location,
      images,
      videos,
      condition,
      negotiable,
      urgentSale
    } = req.body;
    const sellerId = req.body.sellerId || req.user?.id;

    if (!sellerId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Get seller information
    const seller = await User.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    const newItem = new MarketplaceItem({
      title,
      description,
      price: parseFloat(price),
      category,
      tags: tags ? tags.map(tag => tag.toLowerCase().trim()) : [],
      location: location || {},
      images: images || [],
      videos: videos || [],
      condition: condition || 'good',
      negotiable: negotiable !== undefined ? negotiable : true,
      urgentSale: urgentSale || false,
      sellerId,
      sellerName: seller.name,
      sellerEmail: seller.email,
      sellerVerified: seller.verified || false
    });

    const savedItem = await newItem.save();
    
    res.status(201).json({
      success: true,
      message: 'Item added successfully',
      item: savedItem
    });
  } catch (error) {
    console.error('Add item error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to add item'
    });
  }
};

// Get all items with advanced filtering and searching
const getItems = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      minPrice,
      maxPrice,
      search,
      tags,
      location,
      condition,
      negotiable,
      urgentSale,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      sellerId,
      isSold = 'false'
    } = req.query;

    // Build filter object
    const filter = { isSold: isSold === 'true' };

    if (category && category !== 'all') {
      filter.category = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : tags.split(',');
      filter.tags = { $in: tagArray.map(tag => tag.toLowerCase().trim()) };
    }

    if (location) {
      const locationFilter = {};
      if (location.campus) locationFilter['location.campus'] = new RegExp(location.campus, 'i');
      if (location.hostel) locationFilter['location.hostel'] = new RegExp(location.hostel, 'i');
      if (location.block) locationFilter['location.block'] = new RegExp(location.block, 'i');
      Object.assign(filter, locationFilter);
    }

    if (condition) {
      filter.condition = condition;
    }

    if (negotiable !== undefined) {
      filter.negotiable = negotiable === 'true';
    }

    if (urgentSale !== undefined) {
      filter.urgentSale = urgentSale === 'true';
    }

    if (sellerId) {
      filter.sellerId = sellerId;
    }

    // Build sort object
    const sort = {};
    if (sortBy === 'price') {
      sort.price = sortOrder === 'asc' ? 1 : -1;
    } else if (sortBy === 'views') {
      sort.views = -1;
    } else if (sortBy === 'featured') {
      sort.featured = -1;
      sort.createdAt = -1;
    } else {
      sort.createdAt = sortOrder === 'asc' ? 1 : -1;
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const items = await MarketplaceItem.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate('sellerId', 'name email profilePicture verified')
      .lean();

    // Get total count for pagination
    const total = await MarketplaceItem.countDocuments(filter);

    res.json({
      success: true,
      items,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: Number(limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch items'
    });
  }
};

// Get single item by ID with enhanced details
const getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    const item = await MarketplaceItem.findById(id)
      .populate('sellerId', 'name email profilePicture verified joinedAt')
      .lean();

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Add view if user is not the seller
    if (userId && userId !== item.sellerId._id.toString()) {
      await MarketplaceItem.findById(id).then(itemDoc => {
        if (itemDoc) {
          itemDoc.addView(userId);
        }
      });
    } else if (!userId) {
      // Anonymous view
      await MarketplaceItem.findByIdAndUpdate(id, { $inc: { views: 1 } });
    }

    // Get seller's other items
    const sellerItems = await MarketplaceItem.find({
      sellerId: item.sellerId._id,
      _id: { $ne: id },
      isSold: false
    })
    .limit(4)
    .select('title price images createdAt')
    .lean();

    // Get recent comments/questions
    const comments = await Comment.find({
      itemId: id,
      isDeleted: false
    })
    .populate('userId', 'name profilePicture')
    .populate('answeredBy', 'name profilePicture')
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

    res.json({
      success: true,
      item: {
        ...item,
        sellerItems,
        comments
      }
    });
  } catch (error) {
    console.error('Get item by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch item details'
    });
  }
};

// Mark item as sold
const markItemSold = async (req, res) => {
  try {
    const { id } = req.params;
    const { buyerId } = req.body;
    const sellerId = req.body.sellerId || req.user?.id;

    const item = await MarketplaceItem.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check if user is the seller
    if (item.sellerId.toString() !== sellerId) {
      return res.status(403).json({
        success: false,
        message: 'Only the seller can mark item as sold'
      });
    }

    const updatedItem = await MarketplaceItem.findByIdAndUpdate(
      id,
      {
        isSold: true,
        soldAt: new Date(),
        soldTo: buyerId || null
      },
      { new: true }
    );

    // Cancel all pending offers for this item
    await Offer.updateMany(
      { itemId: id, status: 'pending' },
      { status: 'cancelled' }
    );

    res.json({
      success: true,
      message: 'Item marked as sold',
      item: updatedItem
    });
  } catch (error) {
    console.error('Mark item sold error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark item as sold'
    });
  }
};

// Delete item with related data cleanup
const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const sellerId = req.body.sellerId || req.user?.id;

    const item = await MarketplaceItem.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check if user is the seller
    if (item.sellerId.toString() !== sellerId) {
      return res.status(403).json({
        success: false,
        message: 'Only the seller can delete this item'
      });
    }

    // Delete related offers, comments, and messages
    await Promise.all([
      Offer.deleteMany({ itemId: id }),
      Comment.deleteMany({ itemId: id }),
      Message.deleteMany({ relatedItemId: id })
    ]);

    await MarketplaceItem.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Item and related data deleted successfully'
    });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete item'
    });
  }
};

// Get user's items
const getUserItems = async (req, res) => {
  try {
    const sellerId = req.params.userId || req.user?.id;
    const {
      page = 1,
      limit = 12,
      status = 'all', // all, active, sold
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filter = { sellerId };

    if (status === 'active') {
      filter.isSold = false;
    } else if (status === 'sold') {
      filter.isSold = true;
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;
    const items = await MarketplaceItem.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await MarketplaceItem.countDocuments(filter);

    res.json({
      success: true,
      items,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: Number(limit)
      }
    });
  } catch (error) {
    console.error('Get user items error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user items'
    });
  }
};

// Get categories with item counts
const getCategories = async (req, res) => {
  try {
    const categories = await MarketplaceItem.aggregate([
      { $match: { isSold: false } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
};

// OFFER MANAGEMENT

// Create an offer
const createOffer = async (req, res) => {
  try {
    const { itemId, offerPrice, message } = req.body;
    const buyerId = req.user?.id || req.body.buyerId;

    if (!buyerId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const item = await MarketplaceItem.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    if (item.isSold) {
      return res.status(400).json({
        success: false,
        message: 'Item is already sold'
      });
    }

    if (item.sellerId.toString() === buyerId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot make an offer on your own item'
      });
    }

    // Check if user already has a pending offer for this item
    const existingOffer = await Offer.findOne({
      itemId,
      buyerId,
      status: { $in: ['pending', 'counter-offered'] }
    });

    if (existingOffer) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending offer for this item'
      });
    }

    const newOffer = new Offer({
      itemId,
      buyerId,
      sellerId: item.sellerId,
      originalPrice: item.price,
      offerPrice,
      message
    });

    const savedOffer = await newOffer.save();
    await savedOffer.populate([
      { path: 'buyerId', select: 'name email profilePicture' },
      { path: 'itemId', select: 'title price images' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Offer created successfully',
      offer: savedOffer
    });
  } catch (error) {
    console.error('Error creating offer:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating offer'
    });
  }
};

// Get offers for an item (seller view)
const getItemOffers = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user?.id || req.query.userId;

    const item = await MarketplaceItem.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    if (item.sellerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only view offers for your own items'
      });
    }

    const offers = await Offer.find({ itemId })
      .populate('buyerId', 'name email profilePicture verified')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      offers
    });
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching offers'
    });
  }
};

// Get user's offers (buyer view)
const getUserOffers = async (req, res) => {
  try {
    const userId = req.user?.id || req.params.userId;
    const { status, page = 1, limit = 10 } = req.query;

    const filter = { buyerId: userId };
    if (status && status !== 'all') {
      filter.status = status;
    }

    const skip = (page - 1) * limit;
    const offers = await Offer.find(filter)
      .populate('itemId', 'title price images isSold')
      .populate('sellerId', 'name email profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Offer.countDocuments(filter);

    res.json({
      success: true,
      offers,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total
      }
    });
  } catch (error) {
    console.error('Error fetching user offers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user offers'
    });
  }
};

// Respond to offer (accept/reject/counter)
const respondToOffer = async (req, res) => {
  try {
    const { offerId } = req.params;
    const { action, counterPrice, message } = req.body;
    const userId = req.user?.id || req.body.userId;

    const offer = await Offer.findById(offerId)
      .populate('itemId')
      .populate('buyerId', 'name email');

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Offer not found'
      });
    }

    if (offer.sellerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only respond to offers for your own items'
      });
    }

    if (offer.status !== 'pending' && offer.status !== 'counter-offered') {
      return res.status(400).json({
        success: false,
        message: 'This offer has already been responded to'
      });
    }

    let updatedOffer;

    switch (action) {
      case 'accept':
        updatedOffer = await offer.accept(userId);
        break;
      case 'reject':
        updatedOffer = await offer.reject(userId, message);
        break;
      case 'counter':
        if (!counterPrice) {
          return res.status(400).json({
            success: false,
            message: 'Counter price is required'
          });
        }
        updatedOffer = await offer.counter(userId, counterPrice, message);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action'
        });
    }

    res.json({
      success: true,
      message: `Offer ${action}ed successfully`,
      offer: updatedOffer
    });
  } catch (error) {
    console.error('Error responding to offer:', error);
    res.status(500).json({
      success: false,
      message: 'Error responding to offer'
    });
  }
};

// COMMENT MANAGEMENT

// Add comment/question
const addComment = async (req, res) => {
  try {
    const { itemId, content, parentCommentId, isQuestion } = req.body;
    const userId = req.user?.id || req.body.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const item = await MarketplaceItem.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    const user = await User.findById(userId);
    const isSellerResponse = item.sellerId.toString() === userId;
    const isAnswer = parentCommentId && !isQuestion;

    const newComment = new Comment({
      itemId,
      userId,
      userName: user.name,
      userEmail: user.email,
      content,
      parentCommentId: parentCommentId || null,
      isQuestion: isQuestion || false,
      isAnswer,
      isSellerResponse,
      answeredBy: isAnswer ? userId : null
    });

    const savedComment = await newComment.save();
    await savedComment.populate('userId', 'name profilePicture verified');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment: savedComment
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error adding comment'
    });
  }
};

// Get comments for an item
const getItemComments = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { page = 1, limit = 20, type = 'all' } = req.query;

    const filter = { itemId, isDeleted: false };
    
    if (type === 'questions') {
      filter.isQuestion = true;
      filter.parentCommentId = null;
    } else if (type === 'comments') {
      filter.isQuestion = false;
      filter.parentCommentId = null;
    }

    const skip = (page - 1) * limit;
    const comments = await Comment.find(filter)
      .populate('userId', 'name profilePicture verified')
      .populate('answeredBy', 'name profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // Get replies for each comment
    for (let comment of comments) {
      const replies = await Comment.find({
        parentCommentId: comment._id,
        isDeleted: false
      })
      .populate('userId', 'name profilePicture verified')
      .sort({ createdAt: 1 });
      
      comment.replies = replies;
    }

    const total = await Comment.countDocuments(filter);

    res.json({
      success: true,
      comments,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total
      }
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching comments'
    });
  }
};

// Like/unlike comment
const toggleCommentLike = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user?.id || req.body.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    const existingLike = comment.likes.find(like => 
      like.userId.toString() === userId
    );

    let updatedComment;
    if (existingLike) {
      updatedComment = await comment.removeLike(userId);
    } else {
      updatedComment = await comment.addLike(userId);
    }

    res.json({
      success: true,
      data: {
        likesCount: updatedComment.likesCount,
        isLiked: !existingLike
      }
    });
  } catch (error) {
    console.error('Error toggling comment like:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling comment like'
    });
  }
};

// Get trending tags
const getTrendingTags = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    const tagStats = await MarketplaceItem.aggregate([
      { $match: { isSold: false } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: Number(limit) },
      { $project: { tag: '$_id', count: 1, _id: 0 } }
    ]);

    res.json({
      success: true,
      tags: tagStats
    });
  } catch (error) {
    console.error('Error fetching trending tags:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trending tags'
    });
  }
};

// Get marketplace statistics
const getMarketplaceStats = async (req, res) => {
  try {
    const stats = await Promise.all([
      MarketplaceItem.countDocuments({ isSold: false }),
      MarketplaceItem.countDocuments({ isSold: true }),
      MarketplaceItem.distinct('sellerId').then(sellers => sellers.length),
      MarketplaceItem.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    res.json({
      success: true,
      stats: {
        activeListings: stats[0],
        soldItems: stats[1],
        totalSellers: stats[2],
        categoriesBreakdown: stats[3]
      }
    });
  } catch (error) {
    console.error('Error fetching marketplace stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching marketplace stats'
    });
  }
};

module.exports = {
  addItem,
  getItems,
  getItemById,
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
  getTrendingTags,
  getMarketplaceStats
};
