'use client';
import axios from 'axios';
import { useEffect, useState } from 'react';

// where our server is running
const BACKEND_URL = 'http://localhost:7000';

const Home = () => {
  // to store the message from the server
  const [message, setMessage] = useState('');

  // fetch data from the server
  const fetchData = async () => {
    const res = await axios.get(BACKEND_URL);
    setMessage(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // render the message from the server
  return <div>{message || 'Fetching...'}</div>;
};

export default Home;
