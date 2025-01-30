const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, { tls: true });
let db, usersCollection;

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await client.connect();
    db = client.db(process.env.MONGO_DATABASE);
    usersCollection = db.collection('users_data_table');
    console.log('Connected to MongoDB.');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit on connection failure
  }
}

// Call the connection function
connectToMongoDB();

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the backend server!');
});

// API endpoint to add a user
app.post('/add-user', async (req, res) => {
  try {
    const { fullName, email, age, gender, address } = req.body;
    const newUser = { fullName, email, age, gender, address };
    const result = await usersCollection.insertOne(newUser);
    res.status(201).json({ _id: result.insertedId }); // Return the MongoDB-generated _id
  } catch (error) {
    console.error('Error inserting data:', error.message);
    res.status(500).send('Failed to add user.');
  }
});

// API endpoint to delete a user
app.post('/delete-user', (req, res) => {
  const { userId } = req.body;

  // Validate userId format
  if (!ObjectId.isValid(userId)) {
    return res.status(400).send('Invalid user ID format.');
  }

  const objectId = new ObjectId(userId);

  usersCollection
    .deleteOne({ _id: objectId })
    .then((result) => {
      if (result.deletedCount === 0) {
        res.status(404).send('User not found.');
      } else {
        res.status(200).send('User deleted successfully.');
      }
    })
    .catch((err) => {
      console.error('Error deleting user:', err.message);
      res.status(500).send('Failed to delete user.');
    });
});

// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000.');
});