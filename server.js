const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
const mongoURI = 'mongodb+srv://duykhangtrinh1308:foneta1024KHANG@cluster0.txztcs0.mongodb.net/';

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define your MongoDB schema and model here
const itemSchema = new mongoose.Schema({
    name: String,
  });
  
  const Item = mongoose.model('Item', itemSchema);
  
  // API endpoint to get items from MongoDB
  app.get('/api/items', async (req, res) => {
    try {
      const items = await Item.find();
      res.json(items);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    }
  });

// Define routes
app.get('/', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
      } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
      }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
