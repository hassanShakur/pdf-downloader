'use client';
import axios from 'axios';
import { useState } from 'react';

// where our server is running
const BACKEND_URL = 'http://localhost:7000';

// sample list of students each with a name, age and major
const students = [
  {
    name: 'Yuqee Chen',
    age: 21,
    major: 'Computer Science',
  },
  {
    name: 'Jane Doe',
    age: 20,
    major: 'Engineering',
  },
  {
    name: 'Tiffany Wei',
    age: 22,
    major: 'Business',
  },
];

const Home = () => {
  // to store the message from the server
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // fetch data from the server
  const fetchData = async () => {
    setIsLoading(() => true);
    try {
      const { data } = await axios.post(
        `${BACKEND_URL}/generate-pdf`,
        students
      );

      const a = document.createElement('a');

      // Set the href attribute to the data URL of the base64 file
      a.href = 'data:application/pdf;base64,' + data.file;

      // Set the download attribute to the file name
      a.download = 'my-server-doc.pdf';

      // Trigger the download by clicking the element
      a.click();
    } catch (err) {
      setError('Error occurred');
      console.error(err);
    }
    setIsLoading(() => false);
  };

  // render the message from the server
  return (
    <div>
      <button type='button' onClick={fetchData}>
        {isLoading ? 'Downloading...' : 'Click to download pdf!'}
      </button>

      {error && <span>{error}</span>}
    </div>
  );
};

export default Home;
