const MarketplaceItem = require('../models/MarketplaceItem');
const User = require('../models/User');

// Add new item
const addItem = async (req, res) => {
  try {
    const { title, description, price, category, images } = req.body;
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
      images: images || [],
      sellerId,
      sellerName: seller.name,
      sellerEmail: seller.email
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

// Get all items with search and filter
const getItems = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      category = '',
      minPrice = 0,
      maxPrice = Number.MAX_SAFE_INTEGER,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      showSold = 'false'
    } = req.query;

    // Build filter object
    const filter = {};
    
    // Search in title and description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by category
    if (category && category !== 'all') {
      filter.category = category;
    }

    // Filter by price range
    filter.price = { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) };

    // Filter sold items
    if (showSold === 'false') {
      filter.isSold = false;
    }

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const items = await MarketplaceItem.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
      .populate('sellerId', 'name email')
      .lean();

    // Get total count for pagination
    const totalItems = await MarketplaceItem.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / limitNum);

    res.json({
      success: true,
      items,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems,
        itemsPerPage: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
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

// Get single item by ID
const getItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await MarketplaceItem.findById(id)
      .populate('sellerId', 'name email createdAt');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Increment view count
    item.views += 1;
    await item.save();

    res.json({
      success: true,
      item
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

    item.isSold = true;
    await item.save();

    res.json({
      success: true,
      message: 'Item marked as sold',
      item
    });
  } catch (error) {
    console.error('Mark item sold error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark item as sold'
    });
  }
};

// Delete item
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

    await MarketplaceItem.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Item deleted successfully'
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
    const { page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const items = await MarketplaceItem.find({ sellerId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const totalItems = await MarketplaceItem.countDocuments({ sellerId });

    res.json({
      success: true,
      items,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(totalItems / limitNum),
        totalItems
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

module.exports = {
  addItem,
  getItems,
  getItemById,
  markItemSold,
  deleteItem,
  getUserItems,
  getCategories
};
