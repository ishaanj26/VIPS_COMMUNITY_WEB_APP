const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const MarketplaceItem = require('./models/MarketplaceItem');
const User = require('./models/User');

// Sample marketplace items
const sampleItems = [
  {
    title: 'Programming Books Collection',
    description: 'Complete set of programming books including Data Structures, Algorithms, and System Design. All books are in excellent condition with minimal highlighting. Perfect for computer science students.',
    price: 1200,
    category: 'books',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'
    ],
    sellerName: 'Arjun Sharma',
    sellerEmail: 'arjun.sharma@vips.edu',
    views: 25,
    isSold: false
  },
  {
    title: 'MacBook Air M1 2020',
    description: 'Excellent condition MacBook Air with M1 chip, 8GB RAM, 256GB SSD. Includes original charger and box. Perfect for programming and design work. Selling due to upgrade.',
    price: 65000,
    category: 'electronics',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400'
    ],
    sellerName: 'Priya Patel',
    sellerEmail: 'priya.patel@vips.edu',
    views: 89,
    isSold: false
  },
  {
    title: 'Study Table with Chair',
    description: 'Wooden study table with matching chair. Perfect for dorm room or study space. Good condition with minor wear. Dimensions: 120cm x 60cm x 75cm.',
    price: 3500,
    category: 'furniture',
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'
    ],
    sellerName: 'Rahul Singh',
    sellerEmail: 'rahul.singh@vips.edu',
    views: 42,
    isSold: true
  },
  {
    title: 'Nike Running Shoes',
    description: 'Nike Air Zoom Pegasus 38, Size 9 UK. Barely used, excellent condition. Perfect for running and gym workouts. Original box and receipt included.',
    price: 4500,
    category: 'sports',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400'
    ],
    sellerName: 'Sneha Gupta',
    sellerEmail: 'sneha.gupta@vips.edu',
    views: 18,
    isSold: false
  },
  {
    title: 'Engineering Textbooks Set',
    description: 'Complete set of engineering textbooks for Electronics and Communication. Includes circuit analysis, signals and systems, and communication engineering books.',
    price: 2800,
    category: 'books',
    images: [
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400'
    ],
    sellerName: 'Vikram Kumar',
    sellerEmail: 'vikram.kumar@vips.edu',
    views: 33,
    isSold: false
  },
  {
    title: 'iPhone 12 Pro',
    description: 'iPhone 12 Pro 128GB in Space Gray. Excellent condition with minimal scratches. Battery health 89%. Includes original box, charger, and screen protector.',
    price: 45000,
    category: 'electronics',
    images: [
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'
    ],
    sellerName: 'Anita Verma',
    sellerEmail: 'anita.verma@vips.edu',
    views: 67,
    isSold: false
  },
  {
    title: 'Winter Jacket Collection',
    description: 'Set of 3 winter jackets in different styles. All size M, good condition. Perfect for Delhi winter. Selling as a bundle only.',
    price: 2200,
    category: 'clothing',
    images: [
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400'
    ],
    sellerName: 'Karan Malhotra',
    sellerEmail: 'karan.malhotra@vips.edu',
    views: 14,
    isSold: false
  },
  {
    title: 'Gaming Chair',
    description: 'Ergonomic gaming chair with lumbar support and adjustable height. Black and red color scheme. Very comfortable for long study sessions.',
    price: 8500,
    category: 'furniture',
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'
    ],
    sellerName: 'Rohit Sharma',
    sellerEmail: 'rohit.sharma@vips.edu',
    views: 29,
    isSold: false
  }
];

// Sample users
const sampleUsers = [
  {
    name: 'Arjun Sharma',
    email: 'arjun.sharma@vips.edu',
    password: 'hashedpassword123'
  },
  {
    name: 'Priya Patel',
    email: 'priya.patel@vips.edu',
    password: 'hashedpassword123'
  },
  {
    name: 'Rahul Singh',
    email: 'rahul.singh@vips.edu',
    password: 'hashedpassword123'
  },
  {
    name: 'Sneha Gupta',
    email: 'sneha.gupta@vips.edu',
    password: 'hashedpassword123'
  },
  {
    name: 'Vikram Kumar',
    email: 'vikram.kumar@vips.edu',
    password: 'hashedpassword123'
  },
  {
    name: 'Anita Verma',
    email: 'anita.verma@vips.edu',
    password: 'hashedpassword123'
  },
  {
    name: 'Karan Malhotra',
    email: 'karan.malhotra@vips.edu',
    password: 'hashedpassword123'
  },
  {
    name: 'Rohit Sharma',
    email: 'rohit.sharma@vips.edu',
    password: 'hashedpassword123'
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await MarketplaceItem.deleteMany({});
    console.log('Cleared existing marketplace items');

    // Check if users exist, if not create them
    for (const userData of sampleUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        await User.create(userData);
        console.log(`Created user: ${userData.name}`);
      }
    }

    // Get user IDs for marketplace items
    const users = await User.find({});
    const userMap = {};
    users.forEach(user => {
      userMap[user.email] = user._id;
    });

    // Create marketplace items with proper seller IDs
    const itemsWithSellerIds = sampleItems.map(item => ({
      ...item,
      sellerId: userMap[item.sellerEmail] || users[0]._id
    }));

    await MarketplaceItem.insertMany(itemsWithSellerIds);
    console.log(`Seeded ${sampleItems.length} marketplace items`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
