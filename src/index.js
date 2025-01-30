import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

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

  // Add user data to the database
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
        const data = await response.json();
        console.log('User added successfully to the database');
        return data._id; // Return the MongoDB-generated _id
      } else {
        console.error('Failed to add user to the database');
        return null;
      }
    } catch (error) {
      console.error('Error occurred while adding user:', error);
      return null;
    }
  };

  // Function to delete user from the backend
  const deleteUserFromDB = async (userId) => {
    try {
      const response = await fetch('http://localhost:5000/delete-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }), // Sending userId to the backend
      });

      if (response.ok) {
        console.log('User deleted successfully from the database');
        return true;
      } else {
        console.error('Failed to delete user from the database');
        return false;
      }
    } catch (error) {
      console.error('Error occurred while deleting user:', error);
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Custom Validation
    if (formData.age < 18) {
      alert('Age must be 18 or older.');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      alert('Invalid email format.');
      return;
    }
    if (formData.address.length < 10) {
      alert('Please enter a proper address.');
      return;
    }

    // Create a new user
    const newUser = {
      ...formData,
    };

    const userId = await addUserToDB(newUser); // Get the MongoDB-generated _id

    if (userId) {
      // Generate displayId (e.g., USER-1, USER-2)
      const displayId = `USER-${users.length + 1}`;

      // Add the new user to the users list with the MongoDB-generated _id and displayId
      setUsers((prevUsers) => [...prevUsers, { _id: userId, displayId, ...newUser }]);
    }

    // Clear the form after submission
    setFormData({
      fullName: '',
      email: '',
      age: '',
      gender: '',
      address: '',
    });
  };

  // Handle delete button click
  const handleDelete = async (userID) => {
    const isDeleted = await deleteUserFromDB(userID);

    if (isDeleted) {
      // Remove the deleted user from the state
      setUsers((prevUsers) => {
        const updatedUsers = prevUsers.filter((user) => user._id !== userID);

        // Reassign displayIds to maintain sequential order
        return updatedUsers.map((user, index) => ({
          ...user,
          displayId: `USER-${index + 1}`,
        }));
      });
    }
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

        <label>
          Address:
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
          <div key={user._id} className="user-container">
            <h3>{user.displayId}</h3> {/* Display USER-1, USER-2, etc. */}
            <p>
              <strong>Full Name:</strong> {user.fullName}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Age:</strong> {user.age}
            </p>
            <p>
              <strong>Gender:</strong> {user.gender}
            </p>
            <p>
              <strong>Address:</strong> {user.address}
            </p>
            <button onClick={() => handleDelete(user._id)}>Delete</button> {/* Use _id for deletion */}
          </div>
        ))}
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));