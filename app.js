// app.js
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

// Connect to DB
connectDB();

// Middleware
app.use(cors({
    origin: 'https://imit-abhijiths-projects-608231bf.vercel.app',  
    credentials: true                 
  }));
app.use(express.json());



// Routes
app.use('/api', authRoutes);
app.use('/api/posts', postRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
