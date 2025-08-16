import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../../App';
import { 
  Heart, 
  Share2, 
  MapPin, 
  Eye, 
  Calendar, 
  Star, 
  Badge, 
  MessageCircle, 
  Send,
  ThumbsUp,
  Tag,
  Camera,
  Play,
  Verified,
  DollarSign,
  Clock,
  AlertTriangle
} from 'lucide-react';

const ItemDetails = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [offers, setOffers] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newOffer, setNewOffer] = useState({
    price: '',
    message: ''
  });

  useEffect(() => {
    fetchItemDetails();
  }, [id]);

  const fetchItemDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/marketplace/item/${id}?userId=${user?.id || ''}`
      );
      const data = await response.json();

      if (data.success) {
        setItem(data.item);
        if (data.item.comments) {
          setComments(data.item.comments);
        }
      } else {
        setError(data.message || 'Item not found');
      }
    } catch (error) {
      console.error('Error fetching item:', error);
      setError('Failed to load item details');
    } finally {
      setLoading(false);
    }
  };

  const fetchOffers = async () => {
    if (!user || item?.sellerId._id !== user.id) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/marketplace/item/${id}/offers?userId=${user.id}`
      );
      const data = await response.json();

      if (data.success) {
        setOffers(data.offers);
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/marketplace/item/${id}/comments`
      );
      const data = await response.json();

      if (data.success) {
        setComments(data.comments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const submitOffer = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!newOffer.price || parseFloat(newOffer.price) <= 0) {
      alert('Please enter a valid offer price');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/marketplace/offers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId: id,
          offerPrice: parseFloat(newOffer.price),
          message: newOffer.message,
          buyerId: user.id
        })
      });

      const data = await response.json();

      if (data.success) {
        setShowOfferModal(false);
        setNewOffer({ price: '', message: '' });
        alert('Offer submitted successfully!');
      } else {
        alert(data.message || 'Failed to submit offer');
      }
    } catch (error) {
      console.error('Error submitting offer:', error);
      alert('Failed to submit offer');
    }
  };

  const submitComment = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!newComment.trim()) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/marketplace/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemId: id,
          content: newComment,
          userId: user.id,
          isQuestion: false
        })
      });

      const data = await response.json();

      if (data.success) {
        setComments([data.comment, ...comments]);
        setNewComment('');
      } else {
        alert(data.message || 'Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment');
    }
  };

  const toggleCommentLike = async (commentId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/marketplace/comment/${commentId}/like`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id })
        }
      );

      const data = await response.json();

      if (data.success) {
        setComments(comments.map(comment => 
          comment._id === commentId 
            ? { ...comment, likesCount: data.data.likesCount }
            : comment
        ));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const startConversation = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Navigate to messages with pre-filled item context
    navigate(`/messages?to=${item.sellerId._id}&item=${id}`);
  };

  const markAsSold = async () => {
    if (!confirm('Are you sure you want to mark this item as sold?')) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/marketplace/item/${id}/mark-sold`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sellerId: user.id })
        }
      );

      const data = await response.json();

      if (data.success) {
        setItem({ ...item, isSold: true });
        alert('Item marked as sold successfully!');
      } else {
        alert(data.message || 'Failed to mark item as sold');
      }
    } catch (error) {
      console.error('Error marking item as sold:', error);
      alert('Failed to mark item as sold');
    }
  };

  const deleteItem = async () => {
    if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/marketplace/item/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sellerId: user.id })
        }
      );

      const data = await response.json();

      if (data.success) {
        navigate('/marketplace');
        alert('Item deleted successfully!');
      } else {
        alert(data.message || 'Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="bg-gray-300 h-96 rounded-lg mb-6"></div>
          <div className="bg-gray-300 h-8 w-3/4 rounded mb-4"></div>
          <div className="bg-gray-300 h-6 w-1/2 rounded mb-4"></div>
          <div className="bg-gray-300 h-20 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Item Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/marketplace')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  const isOwner = user && item.sellerId._id === user.id;
  const hasMultipleImages = item.images && item.images.length > 1;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative">
            <img
              src={item.images?.[selectedImageIndex]?.url || item.images?.[0] || 'https://via.placeholder.com/500x400?text=No+Image'}
              alt={item.title}
              className="w-full h-96 object-cover rounded-lg"
            />
            
            {/* Sold Badge */}
            {item.isSold && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                SOLD
              </div>
            )}

            {/* Urgent Sale Badge */}
            {item.urgentSale && !item.isSold && (
              <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                <AlertTriangle size={14} />
                URGENT
              </div>
            )}

            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button className="bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
                <Heart size={20} className="text-gray-700" />
              </button>
              <button className="bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
                <Share2 size={20} className="text-gray-700" />
              </button>
            </div>

            {/* Image Count Badge */}
            {hasMultipleImages && (
              <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                <Camera size={14} />
                {selectedImageIndex + 1}/{item.images.length}
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {hasMultipleImages && (
            <div className="grid grid-cols-4 gap-2">
              {item.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image?.url || image}
                    alt={`${item.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Videos */}
          {item.videos && item.videos.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">Videos</h3>
              <div className="grid grid-cols-2 gap-2">
                {item.videos.map((video, index) => (
                  <div key={index} className="relative aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                    <Play className="text-gray-400" size={32} />
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                      {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Item Details */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>
              {item.sellerVerified && (
                <Verified className="text-blue-500" size={24} />
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-green-600">₹{item.price.toLocaleString()}</span>
                {item.negotiable && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Negotiable</span>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Eye size={16} />
                  {item.views} views
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  {new Date(item.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Condition & Tags */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Condition:</span>
              <span className="capitalize bg-gray-100 px-2 py-1 rounded text-sm">
                {item.condition}
              </span>
            </div>

            {item.tags && item.tags.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-700 mb-2 block">Tags:</span>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm"
                    >
                      <Tag size={12} />
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Location */}
          {item.location && (
            <div className="flex items-start gap-2">
              <MapPin className="text-gray-400 mt-1" size={16} />
              <div className="text-sm text-gray-600">
                <div>{item.location.campus}</div>
                {item.location.hostel && (
                  <div>{item.location.hostel} {item.location.block && `- ${item.location.block}`}</div>
                )}
                {item.location.room && <div>Room: {item.location.room}</div>}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{item.description}</p>
          </div>

          {/* Seller Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Seller Information</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {item.sellerId.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.sellerId.name}</span>
                  {item.sellerVerified && (
                    <Badge className="text-blue-500" size={16} />
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  Member since {new Date(item.sellerId.joinedAt || item.sellerId.createdAt).getFullYear()}
                </div>
              </div>
            </div>

            {/* Other Items by Seller */}
            {item.sellerItems && item.sellerItems.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Other items by {item.sellerId.name}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {item.sellerItems.slice(0, 4).map((sellerItem) => (
                    <div
                      key={sellerItem._id}
                      className="bg-white p-2 rounded border cursor-pointer hover:shadow-sm"
                      onClick={() => navigate(`/marketplace/item/${sellerItem._id}`)}
                    >
                      <img
                        src={sellerItem.images?.[0]?.url || sellerItem.images?.[0] || 'https://via.placeholder.com/100?text=No+Image'}
                        alt={sellerItem.title}
                        className="w-full h-16 object-cover rounded mb-1"
                      />
                      <div className="text-xs">
                        <div className="font-medium truncate">{sellerItem.title}</div>
                        <div className="text-green-600">₹{sellerItem.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {!isOwner && !item.isSold && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setShowOfferModal(true)}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <DollarSign size={20} />
                  Make Offer
                </button>
                <button
                  onClick={startConversation}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <MessageCircle size={20} />
                  Message Seller
                </button>
              </div>
            )}

            {isOwner && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {!item.isSold && (
                  <button
                    onClick={markAsSold}
                    className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Mark as Sold
                  </button>
                )}
                <button
                  onClick={() => navigate(`/marketplace/item/${id}/edit`)}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit Item
                </button>
                <button
                  onClick={deleteItem}
                  className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Item
                </button>
              </div>
            )}

            {isOwner && (
              <button
                onClick={() => {
                  fetchOffers();
                  setShowOfferModal(true);
                }}
                className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                View Offers ({offers.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-12">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Questions & Comments</h3>

          {/* Add Comment */}
          {user && (
            <div className="mb-6">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Ask a question or leave a comment..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={submitComment}
                      disabled={!newComment.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Send size={16} />
                      Post Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment._id} className="flex gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                    {comment.userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{comment.userName}</span>
                        {comment.isSellerResponse && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">Seller</span>
                        )}
                        <span className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <button
                        onClick={() => toggleCommentLike(comment._id)}
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600"
                      >
                        <ThumbsUp size={14} />
                        {comment.likesCount || 0}
                      </button>
                      <button className="text-sm text-gray-500 hover:text-blue-600">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">
                No comments yet. Be the first to ask a question!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Offer Modal */}
      {showOfferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {isOwner ? 'Offers Received' : 'Make an Offer'}
            </h3>

            {isOwner ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {offers.length > 0 ? (
                  offers.map((offer) => (
                    <div key={offer._id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium">{offer.buyerId.name}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(offer.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">
                            ₹{offer.offerPrice.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            from ₹{offer.originalPrice.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      {offer.message && (
                        <p className="text-gray-700 text-sm mb-3">{offer.message}</p>
                      )}
                      {offer.status === 'pending' && (
                        <div className="flex gap-2">
                          <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                            Accept
                          </button>
                          <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">
                            Reject
                          </button>
                          <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                            Counter
                          </button>
                        </div>
                      )}
                      {offer.status !== 'pending' && (
                        <div className="text-sm capitalize font-medium">
                          Status: <span className={`${
                            offer.status === 'accepted' ? 'text-green-600' : 
                            offer.status === 'rejected' ? 'text-red-600' : 'text-gray-600'
                          }`}>{offer.status}</span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No offers yet</p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Offer (₹)
                  </label>
                  <input
                    type="number"
                    value={newOffer.price}
                    onChange={(e) => setNewOffer({...newOffer, price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Original price: ₹${item.price.toLocaleString()}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message (Optional)
                  </label>
                  <textarea
                    value={newOffer.message}
                    onChange={(e) => setNewOffer({...newOffer, message: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Add a message with your offer..."
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowOfferModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              {!isOwner && (
                <button
                  onClick={submitOffer}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Submit Offer
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetails;
