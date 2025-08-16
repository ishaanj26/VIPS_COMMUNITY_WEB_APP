
require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());


// Connect to MongoDB
connectDB();


// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const marketplaceRoutes = require('./routes/marketplace');
const messageRoutes = require('./routes/messages');
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/messages', messageRoutes);

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
