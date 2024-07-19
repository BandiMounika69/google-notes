import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import { faL } from '@fortawesome/free-solid-svg-icons';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      await axios.post('https://google-notes99.onrender.com/api/auth/register', formData);
      navigate('/login');
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data); // Set error message from server
      } else {
        setError('Registration error, please try again.'); // Default error message
      }
    }finally{
      setLoading(false)
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      {error && <div className="error-message">{error}</div>}
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <button type="submit" disabled={loading}>
        {loading ? <ClipLoader size={20} color={"#fff"} /> : 'Register'}
      </button>
      <p>Already have an Account? <Link to="/login">Login</Link></p>
    </form>
  );
};

export default Register;
