const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');

// Load environment variables
dotenv.config();

// Import routes
const contactRoutes = require('./routes/contactRoutes');
const groupRoutes = require('./routes/groupRoutes');
const templateRoutes = require('./routes/templateRoutes');
const campaginRoutes  = require("./routes/campaignRoutes");
const messageRoutes = require('./routes/messageRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
// Routes

const app = express();
const PORT = process.env.PORT || 5100;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/contacts', contactRoutes);
app.use('/api/groups', groupRoutes); 
app.use('/api/templates', templateRoutes);
app.use('/api/campaigns',campaginRoutes);
app.use('/api/messages', messageRoutes);
app.use('/webhook', webhookRoutes); 


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Database sync and server start
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Sync all models
    await sequelize.sync();
    console.log('Database synchronized successfully');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
};

startServer();