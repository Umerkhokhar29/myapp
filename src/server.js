const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root", 
  password: "nokia469", 
  database: "user_data",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err.message);
  } else {
    console.log("Connected to MySQL database.");
  }
});

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the backend server!");
});

// API endpoint to add a user
app.post("/add-user", (req, res) => {
  const { fullName, email, age, gender, address } = req.body;

  const query = "INSERT INTO users_data_table (fullName, email, age, gender, address) VALUES (?, ?, ?, ?, ?)";
  db.query(query, [fullName, email, age, gender, address], (err, result) => {
    if (err) {
      console.error("Error inserting data:", err.message);
      res.status(500).send("Failed to add user.");
    } else {
      res.status(201).send("User added successfully.");
    }
  });
});
app.post("/delete-user", (req,res) => {
    const {userId} = req.body;

    const query = "DELETE from users_data_table where id = ? ";
    db.query(query, [userId], (err,result)=> {
        if(err){
            console.error("Error deleting data:",err.message);
            res.status(500).send("Failed to delete user.");
        }
        else if(result.affectedRows=0){
            res.status(404).send("User not found.");
        }
        else{
            res.status(200).send("User deleted successfully.")
        }
    }); 

    
});

// Start the server
app.listen(5000, () => {
  console.log("Server is running on port 5000.");
});
