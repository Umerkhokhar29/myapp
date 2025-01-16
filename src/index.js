import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

let userIdCounter = 1; // Starting ID for users--incremental ID

const App = () => {
  // State to manage form fields and the list of users
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    age: '',
    gender: '',
    address: '',
  });
  const [users, setUsers] = useState([]); // Store submitted users here

  // Handling input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //adds user data to the datatbae
  const addUserToDB = async (userData) => {
    try {
      const response = await fetch('http://localhost:5000/add-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      if (response.ok) {
        console.log('User added successfully to the database');
      } else {
        console.error('Failed to add user to the database');
      }
    } catch (error) {
      console.error('Error occurred while adding user:', error);
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Custom Validation
    if (formData.age < 18) {
      alert("Age must be 18 or older.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      alert("Invalid email format.");
      return;
    }
    if(formData.address.length < 10){
      alert("Please enter a proper address.");
      return;
    }

    // Create a new user with a unique ID
    const newUser = {
      id: `USER-${userIdCounter++}`, // Incremental ID
      ...formData,
    }
    
    addUserToDB(newUser);
    ;

    // Add the new user to the users list
    setUsers((prevUsers) => [...prevUsers, newUser]);

    // Clear the form after submission
    setFormData({
      fullName: '',
      email: '',
      age: '',
      gender: '',
      address: '',
    });
  };

  // Handle deleting user
  const handleDelete = (userId) => {
    setUsers(users.filter((user) => user.id !== userId));
  };

  return (
    <div className="form-container">
      <h1>User Form</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Full Name:
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </label>
        <br />

        <label>
          Email Address:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <br />

        <label>
          Age:
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            min="18"
            required
          />
        </label>
        <br />

        <label>
          Gender:
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </label>
        <br />
    <label>Address:</label>
      <label> .
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </label>
        <br />

        <button type="submit">Submit</button>
      </form>

      {/* Display user containers */}
      <div className="users-list">
        {users.map((user) => (
          <div key={user.id} className="user-container">
            <h3>{user.id}</h3>
            <p><strong>Full Name:</strong> {user.fullName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Age:</strong> {user.age}</p>
            <p><strong>Gender:</strong> {user.gender}</p>
            <p><strong>Address:</strong> {user.address}</p>
            <button onClick={() => handleDelete(user.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
