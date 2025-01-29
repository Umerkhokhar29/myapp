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
    res.status(201).json({ _id: result.insertedId });
  } catch (error) {
    console.error('Error inserting data:', error.message);
    res.status(500).send('Failed to add user.');
  }
});

// API endpoint to delete a user
app.post('/delete-user', async (req, res) => {
  const { userId } = req.body;

  if (!ObjectId.isValid(userId)) {
    return res.status(400).send('Invalid user ID format.');
  }

  const objectId = new ObjectId(userId);

  try {
    const result = await usersCollection.deleteOne({ _id: objectId });
    if (result.deletedCount === 0) {
      res.status(404).send('User not found.');
    } else {
      res.status(200).send('User deleted successfully.');
    }
  } catch (error) {
    console.error('Error deleting user:', error.message);
    res.status(500).send('Failed to delete user.');
  }
});

module.exports = app;