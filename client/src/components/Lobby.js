import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCodeBlocks } from '../services/api.js';
import '../styles/Lobby.css';

function Lobby (){

const [codeBlocks, setCodeBlocks] = useState([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  async function fetchCodeBlocks() {
    try {
      const blocks = await getCodeBlocks();
      setCodeBlocks(blocks);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to fetch code blocks. Please try again later.");
      setIsLoading(false);
    }
  }
  fetchCodeBlocks();
}, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  
  return (
    <div className="lobby">
      <h1 className="header">Online Coding Web Application</h1>
      <h2 className="subheader">Choose a Code Block:</h2>
      <div className="code-blocks-container">
        {codeBlocks.map(codeBlock => (
          <div className="code-block-card" key={codeBlock.codeName}>
            <h3 className="code-block-title">{codeBlock.title}</h3>
            <p className="code-block-code-name"> {codeBlock.codeName}</p>
            <Link to={`/codeblock/${codeBlock.codeName}`} className="code-block-link">Start Coding</Link>
          </div>
        ))}
      </div>
    </div>
  ); 
}

export default Lobby;

  
