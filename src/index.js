import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

let userIdCounter = 1; // Starting ID for users

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
    if(formData.address.length<10){
      alert("Please enter proper Address");
      return;
    }

    // Create a new user with a unique ID
    const newUser = {
      id: `USER-${userIdCounter++}`, // Incremental ID
      ...formData,
    };

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
          <div key={user.id} className="user-container">
            <h3>{user.id}</h3>
            <p><strong>Full Name:</strong> {user.fullName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Age:</strong> {user.age}</p>
            <p><strong>Gender:</strong> {user.gender}</p>
            <p><strong>Address:</strong> {user.address}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
