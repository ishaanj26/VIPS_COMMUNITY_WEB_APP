import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../../App';
import { Upload, X, Plus, AlertCircle, MapPin, Tag, Video } from 'lucide-react';

const AddItem = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const { id } = useParams(); // Get item ID for edit mode
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    tags: [],
    location: {
      campus: 'Main Campus',
      hostel: '',
      block: '',
      room: ''
    },
    images: [],
    videos: [],
    condition: 'good',
    negotiable: true,
    urgentSale: false
  });

  const categories = [
    { value: '', label: 'Select Category' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'books', label: 'Books' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'sports', label: 'Sports' },
    { value: 'vehicles', label: 'Vehicles' },
    { value: 'other', label: 'Other' }
  ];

  // Check if we're in edit mode and fetch item data
  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      fetchItemData();
    }
  }, [id]);

  const fetchItemData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/marketplace/item/${id}`);
      const data = await response.json();

      if (data.success) {
        const item = data.item;
        
        // Check if current user is the owner
        if (item.sellerId._id !== user._id) {
          alert('You can only edit your own items');
          navigate('/marketplace/my-items');
          return;
        }

        setFormData({
          title: item.title || '',
          description: item.description || '',
          price: item.price?.toString() || '',
          category: item.category || '',
          tags: item.tags || [],
          location: item.location || {
            campus: 'Main Campus',
            hostel: '',
            block: '',
            room: ''
          },
          images: item.images || [],
          videos: item.videos || [],
          condition: item.condition || 'good',
          negotiable: item.negotiable !== undefined ? item.negotiable : true,
          urgentSale: item.urgentSale || false
        });
      } else {
        alert('Item not found');
        navigate('/marketplace/my-items');
      }
    } catch (error) {
      console.error('Error fetching item:', error);
      alert('Failed to load item data');
      navigate('/marketplace/my-items');
    } finally {
      setLoading(false);
    }
  };

  const conditions = [
    { value: 'new', label: 'Brand New' },
    { value: 'like-new', label: 'Like New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' }
  ];

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleTagInput = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = e.target.value.trim().toLowerCase();
      if (tag && !formData.tags.includes(tag) && formData.tags.length < 10) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tag]
        }));
        e.target.value = '';
      }
    }
  };

  const removeTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    processImageFiles(files);
  };

  const processImageFiles = (files) => {
    // For now, we'll use placeholder URLs
    // In production, implement proper image upload to Cloudinary/AWS S3
    const imageUrls = files.map((file, index) => ({
      url: `https://via.placeholder.com/400x400?text=Image+${formData.images.length + index + 1}`,
      caption: '',
      isPrimary: formData.images.length === 0 && index === 0
    }));
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...imageUrls].slice(0, 8) // Max 8 images
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      processImageFiles(imageFiles);
    }
  };

  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // For now, we'll use placeholder URLs
    const videoUrls = files.map((file, index) => ({
      url: `https://via.placeholder.com/400x300.mp4?text=Video+${formData.videos.length + index + 1}`,
      caption: '',
      duration: 30 // placeholder duration
    }));
    
    setFormData(prev => ({
      ...prev,
      videos: [...prev.videos, ...videoUrls].slice(0, 3) // Max 3 videos
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const removeVideo = (index) => {
    setFormData(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index)
    }));
  };

  const setPrimaryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        isPrimary: i === index
      }))
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const url = isEditMode 
        ? `${import.meta.env.VITE_SERVER_URL}/api/marketplace/item/${id}`
        : `${import.meta.env.VITE_SERVER_URL}/api/marketplace/add-item`;
      
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          sellerId: user._id,
          price: parseFloat(formData.price)
        })
      });

      const data = await response.json();

      if (data.success) {
        const itemId = isEditMode ? id : data.item._id;
        navigate(`/marketplace/item/${itemId}`, { replace: true });
        // Scroll to top of the page
        window.scrollTo(0, 0);
      } else {
        setErrors({ submit: data.message || `Failed to ${isEditMode ? 'update' : 'add'} item` });
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'adding'} item:`, error);
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {isEditMode ? 'Edit Your Item' : 'List Your Item'}
        </h1>

        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle size={20} />
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Item Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.title ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter item title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.category ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
              </div>

              {/* Condition */}
              <div>
                <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-2">
                  Condition
                </label>
                <select
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {conditions.map(condition => (
                    <option key={condition.value} value={condition.value}>{condition.label}</option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.price ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
              </div>

              {/* Price Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Options
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="negotiable"
                      checked={formData.negotiable}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Price is negotiable</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="urgentSale"
                      checked={formData.urgentSale}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Urgent sale</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Describe your item in detail..."
              />
              <div className="flex justify-between mt-1">
                {errors.description ? (
                  <p className="text-sm text-red-600">{errors.description}</p>
                ) : (
                  <div></div>
                )}
                <p className="text-sm text-gray-500">
                  {formData.description.length}/1000
                </p>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Tag size={20} />
              Tags (Optional)
            </h2>
            
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  onKeyDown={handleTagInput}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Type a tag and press Enter (e.g., gaming, study, exam-prep)"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Press Enter or comma to add a tag. Max 10 tags.
                </p>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin size={20} />
              Location (Optional)
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label htmlFor="campus" className="block text-sm font-medium text-gray-700 mb-1">
                  Campus
                </label>
                <input
                  type="text"
                  id="campus"
                  name="location.campus"
                  value={formData.location.campus}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Main Campus"
                />
              </div>
              
              <div>
                <label htmlFor="hostel" className="block text-sm font-medium text-gray-700 mb-1">
                  Hostel
                </label>
                <input
                  type="text"
                  id="hostel"
                  name="location.hostel"
                  value={formData.location.hostel}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Hostel name"
                />
              </div>
              
              <div>
                <label htmlFor="block" className="block text-sm font-medium text-gray-700 mb-1">
                  Block
                </label>
                <input
                  type="text"
                  id="block"
                  name="location.block"
                  value={formData.location.block}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Block A"
                />
              </div>
              
              <div>
                <label htmlFor="room" className="block text-sm font-medium text-gray-700 mb-1">
                  Room
                </label>
                <input
                  type="text"
                  id="room"
                  name="location.room"
                  value={formData.location.room}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Room 101"
                />
              </div>
            </div>
          </div>

          {/* Media Upload */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Media (Optional)</h2>
            
            {/* Images */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images
              </label>
              
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.url}
                        alt={`Preview ${index + 1}`}
                        className={`w-full aspect-square object-cover rounded-lg border-2 ${
                          image.isPrimary ? 'border-blue-500' : 'border-gray-200'
                        }`}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setPrimaryImage(index)}
                            className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                          >
                            {image.isPrimary ? 'Primary' : 'Set Primary'}
                          </button>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="bg-red-500 text-white rounded-full p-1"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {formData.images.length < 8 && (
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600">
                      Click to upload images or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, GIF up to 10MB ({formData.images.length}/8)
                    </p>
                  </label>
                </div>
              )}
            </div>

            {/* Videos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Videos (Max 5 minutes each)
              </label>
              
              {formData.videos.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  {formData.videos.map((video, index) => (
                    <div key={index} className="relative group">
                      <div className="w-full aspect-video bg-gray-200 rounded-lg border border-gray-200 flex items-center justify-center">
                        <Video className="text-gray-400" size={48} />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeVideo(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {formData.videos.length < 3 && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                    id="video-upload"
                  />
                  <label htmlFor="video-upload" className="cursor-pointer">
                    <Video className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600">
                      Click to upload videos or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      MP4, AVI, MOV up to 50MB, max 5 minutes ({formData.videos.length}/3)
                    </p>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/marketplace')}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (isEditMode ? 'Updating Item...' : 'Adding Item...') : (isEditMode ? 'Update Item' : 'List Item')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItem;
