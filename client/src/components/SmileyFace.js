import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SmileyFace.css';

function SmileyFace() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/'); // redirect to the lobby 
    }, 3000);

    return () => clearTimeout(timer); 
  }, [navigate]);

  return (
    <div className="smiley-face-overlay">
      <div className="smiley-face-content">
        <span role="img" aria-label="smiley face">😊</span>
      </div>
    </div>
  );
}

export default SmileyFace;