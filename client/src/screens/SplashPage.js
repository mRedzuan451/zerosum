import React from 'react';
import { useNavigate } from 'react-router-dom';

const SplashPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h1>Zero Sum</h1>
      <p>Welcome to the Neon Cypher!</p>
      <button onClick={() => navigate('/menu')}>Enter</button>
    </div>
  );
};

export default SplashPage;
