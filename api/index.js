const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

let db, usersCollection;

// Connect to MongoDB
async function connectToMongoDB() {
  const client = new MongoClient(process.env.MONGO_URI, { tls: true });
  try {
    await client.connect();
    db = client.db(process.env.MONGO_DATABASE);
    usersCollection = db.collection('users_data_table');
    console.log('Connected to MongoDB.');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
}

connectToMongoDB();

// API endpoint to add a user
app.post('/add-user', async (req, res) => {
  try {
    const { fullName, email, age, gender, address } = req.body;
    const newUser = { fullName, email, age, gender, address };
    const result = await usersCollection.insertOne(newUser);
    console.log('User added:', result.insertedId);
    res.status(201).json({ _id: result.insertedId });
  } catch (error) {
    console.error('Error inserting data:', error.message);
    res.status(500).send('Failed to add user.');
  }
});

// Export the Express app as a serverless function
module.exports = app;