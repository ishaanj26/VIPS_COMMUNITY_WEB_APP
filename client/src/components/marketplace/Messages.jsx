import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserContext } from '../../App';
import { 
  Send, 
  Paperclip, 
  Search, 
  MoreVertical, 
  ArrowLeft,
  Phone,
  Video,
  Info,
  Image as ImageIcon,
  FileText,
  Clock,
  Check,
  CheckCheck
} from 'lucide-react';

const Messages = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const messagesEndRef = useRef(null);
  
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    fetchConversations();
    
    // Check if we need to start a conversation from URL params
    const toUserId = searchParams.get('to');
    const itemId = searchParams.get('item');
    
    if (toUserId && itemId) {
      startConversationFromParams(toUserId, itemId);
    }
  }, [user, searchParams]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/messages/conversations`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const data = await response.json();

      if (data.success) {
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/messages/conversation/${conversationId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const data = await response.json();

      if (data.success) {
        setMessages(data.messages);
        markMessagesAsRead(conversationId);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const markMessagesAsRead = async (conversationId) => {
    try {
      await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/messages/conversation/${conversationId}/read`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const startConversationFromParams = async (toUserId, itemId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/messages/start`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            receiverId: toUserId,
            itemId: itemId,
          }),
        }
      );
      const data = await response.json();

      if (data.success) {
        setSelectedConversation(data.conversation);
        fetchConversations(); // Refresh conversations list
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sending) return;

    setSending(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/api/messages/send`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({
            conversationId: selectedConversation._id,
            content: newMessage,
          }),
        }
      );
      const data = await response.json();

      if (data.success) {
        setMessages([...messages, data.message]);
        setNewMessage('');
        fetchConversations(); // Refresh to update last message
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString) => {
    const messageDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const getOtherParticipant = (conversation) => {
    return conversation.participants.find(p => p._id !== user._id);
  };

  const filteredConversations = conversations.filter(conv => {
    const otherParticipant = getOtherParticipant(conv);
    return otherParticipant?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           conv.item?.title?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const MessageStatus = ({ message }) => {
    if (message.sender._id !== user._id) return null;

    if (message.readAt) {
      return <CheckCheck size={14} className="text-blue-500" />;
    } else {
      return <Check size={14} className="text-gray-400" />;
    }
  };

  const ConversationItem = ({ conversation }) => {
    const otherParticipant = getOtherParticipant(conversation);
    const hasUnread = conversation.lastMessage?.sender?._id !== user._id && !conversation.lastMessage?.readAt;

    return (
      <div
        onClick={() => setSelectedConversation(conversation)}
        className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
          selectedConversation?._id === conversation._id ? 'bg-blue-50 border-blue-200' : ''
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-lg font-semibold text-gray-600">
              {otherParticipant?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-gray-900 truncate">
                {otherParticipant?.name}
              </h3>
              <span className="text-xs text-gray-500">
                {conversation.lastMessage && formatTime(conversation.lastMessage.createdAt)}
              </span>
            </div>
            
            {conversation.item && (
              <p className="text-xs text-blue-600 mb-1 truncate">
                About: {conversation.item.title}
              </p>
            )}
            
            <div className="flex items-center justify-between">
              <p className={`text-sm truncate ${hasUnread ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                {conversation.lastMessage?.content || 'No messages yet'}
              </p>
              {hasUnread && (
                <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Conversations Sidebar */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
            <button
              onClick={() => navigate('/marketplace')}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft size={20} />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => (
              <ConversationItem key={conversation._id} conversation={conversation} />
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              {searchTerm ? 'No conversations found' : 'No conversations yet'}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-gray-600">
                      {getOtherParticipant(selectedConversation)?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {getOtherParticipant(selectedConversation)?.name}
                    </h2>
                    {selectedConversation.item && (
                      <p className="text-sm text-blue-600">
                        About: {selectedConversation.item.title}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                    <Phone size={20} />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                    <Video size={20} />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                    <Info size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => {
                const isOwnMessage = message.sender._id === user._id;
                const showDate = index === 0 || 
                  formatDate(message.createdAt) !== formatDate(messages[index - 1].createdAt);

                return (
                  <div key={message._id}>
                    {showDate && (
                      <div className="text-center my-4">
                        <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {formatDate(message.createdAt)}
                        </span>
                      </div>
                    )}
                    
                    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isOwnMessage
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div className={`flex items-center justify-end gap-1 mt-1 ${
                          isOwnMessage ? 'text-blue-200' : 'text-gray-500'
                        }`}>
                          <span className="text-xs">{formatTime(message.createdAt)}</span>
                          <MessageStatus message={message} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-end gap-3">
                <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                  <Paperclip size={20} />
                </button>
                
                <div className="flex-1">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    rows={1}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ minHeight: '40px', maxHeight: '120px' }}
                  />
                </div>
                
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || sending}
                  className={`p-2 rounded-lg transition-colors ${
                    newMessage.trim() && !sending
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="text-gray-400" size={48} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No conversation selected</h3>
              <p className="text-gray-600">
                Choose a conversation from the sidebar to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
