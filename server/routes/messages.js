const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');

// Middleware for authentication
const authenticateUser = (req, res, next) => {
  // For now, we'll extract userId from request body or params
  // In production, implement proper JWT authentication
  next();
};

// Send a message
const sendMessage = async (req, res) => {
  try {
    const {
      receiverId,
      content,
      messageType = 'text',
      attachments = [],
      relatedItemId,
      relatedOfferId,
      replyTo
    } = req.body;
    const senderId = req.user?.id || req.body.senderId;

    if (!senderId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (senderId === receiverId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot send a message to yourself'
      });
    }

    // Get sender and receiver info
    const [sender, receiver] = await Promise.all([
      User.findById(senderId),
      User.findById(receiverId)
    ]);

    if (!sender || !receiver) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const conversationId = Message.generateConversationId(senderId, receiverId);

    const newMessage = new Message({
      conversationId,
      senderId,
      receiverId,
      senderName: sender.name,
      receiverName: receiver.name,
      content,
      messageType,
      attachments,
      relatedItemId,
      relatedOfferId,
      replyTo
    });

    const savedMessage = await newMessage.save();
    await savedMessage.populate([
      { path: 'senderId', select: 'name profilePicture' },
      { path: 'receiverId', select: 'name profilePicture' },
      { path: 'relatedItemId', select: 'title price images' },
      { path: 'relatedOfferId', select: 'offerPrice status' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: savedMessage
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Error sending message'
    });
  }
};

// Get conversation between two users
const getConversation = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const currentUserId = req.user?.id || req.query.currentUserId;

    if (!currentUserId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Check if current user is part of the conversation
    if (currentUserId !== userId1 && currentUserId !== userId2) {
      return res.status(403).json({
        success: false,
        message: 'You can only view your own conversations'
      });
    }

    const messages = await Message.getConversation(userId1, userId2, page, limit);

    // Mark messages as read for the current user
    await Message.updateMany(
      {
        conversationId: Message.generateConversationId(userId1, userId2),
        receiverId: currentUserId,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    res.json({
      success: true,
      data: messages.reverse(), // Reverse to show oldest first
      pagination: {
        currentPage: Number(page),
        itemsPerPage: Number(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching conversation'
    });
  }
};

// Get user's conversations list
const getUserConversations = async (req, res) => {
  try {
    const userId = req.user?.id || req.params.userId;
    const { page = 1, limit = 20 } = req.query;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Get distinct conversations for the user
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ senderId: userId }, { receiverId: userId }],
          isDeleted: false
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$receiverId', userId] },
                    { $eq: ['$isRead', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $sort: { 'lastMessage.createdAt': -1 }
      },
      {
        $skip: (page - 1) * limit
      },
      {
        $limit: Number(limit)
      }
    ]);

    // Populate user details
    for (let conv of conversations) {
      const otherUserId = conv.lastMessage.senderId.toString() === userId 
        ? conv.lastMessage.receiverId 
        : conv.lastMessage.senderId;
      
      const otherUser = await User.findById(otherUserId)
        .select('name profilePicture verified');
      
      conv.otherUser = otherUser;
    }

    res.json({
      success: true,
      data: conversations,
      pagination: {
        currentPage: Number(page),
        itemsPerPage: Number(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching conversations'
    });
  }
};

// Mark message as read
const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user?.id || req.body.userId;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    if (message.receiverId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only mark your own messages as read'
      });
    }

    await message.markAsRead();

    res.json({
      success: true,
      message: 'Message marked as read'
    });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking message as read'
    });
  }
};

// Delete message
const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user?.id || req.body.userId;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    if (message.senderId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own messages'
      });
    }

    await message.softDelete(userId);

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting message'
    });
  }
};

// Get unread message count for user
const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user?.id || req.params.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const unreadCount = await Message.countDocuments({
      receiverId: userId,
      isRead: false,
      isDeleted: false
    });

    res.json({
      success: true,
      unreadCount
    });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching unread count'
    });
  }
};

// ROUTES
router.post('/send', authenticateUser, sendMessage);
router.get('/conversation/:userId1/:userId2', authenticateUser, getConversation);
router.get('/user/:userId/conversations', authenticateUser, getUserConversations);
router.put('/message/:messageId/read', authenticateUser, markAsRead);
router.delete('/message/:messageId', authenticateUser, deleteMessage);
router.get('/user/:userId/unread-count', authenticateUser, getUnreadCount);

module.exports = router;
