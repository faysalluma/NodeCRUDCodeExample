// Import Express for API
const express = require('express');
const app = express();
app.use(express.json());// Body parser (Parser en JSON les req)

// To get path project
const path = require('path');

// Import routes
const stuffRoutes = require('./routes/stuff');
const userRoutes = require('./routes/user');

// Import Mongoose for BD
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://faysalluma:6764SECRETluma@cluster0.jgile.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Middleware for throw an exception for http request
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Defined routes
app.use('/api/stuff', stuffRoutes);
app.use('/api/auth', userRoutes);

// Authorize files saved into images directory
app.use('/images', express.static(path.join(__dirname, 'images')));

// Export module for using to another place (by import)
module.exports = app;