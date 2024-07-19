import React, {useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import Header from './Header';
import ClipLoader from 'react-spinners/ClipLoader';
import "../App.css"

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const[loading,setLoading] = useState(false)
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const res = await axios.post('https://google-notes99.onrender.com/api/auth/login', formData);
      const token = res.data.token;
      localStorage.setItem('token', token);
      Cookies.set('token', token, { expires: 7 }); // Set token in cookie with 7 days expiry
      console.log(token);
      navigate('/');
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data); // Set error message from server
      } else {
        setError('Login error, please try again.'); // Default error message
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
        {loading ? <ClipLoader size={20} color={"#fff"} /> : 'Login'}
      </button>
      <p>Don't have an Account? <Link to="/register">Register</Link></p>
    </form>
  );
};

export default Login;
