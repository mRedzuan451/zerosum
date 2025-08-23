import React from 'react';


const testCards = [1, 2, 3, 4, 5, 6, 7];

const cardStyle = {
  display: 'inline-block',
  width: '60px',
  height: '60px',
  margin: '10px',
  background: '#222',
  color: '#0ff',
  fontSize: '2em',
  borderRadius: '8px',
  border: '2px solid #0ff',
  textAlign: 'center',
  lineHeight: '60px',
  boxShadow: '0 0 10px #0ff',
};

const GameTable = () => (
  <div>
    <h2>Game Table</h2>
    <div>
      {testCards.map((num, idx) => (
        <div key={idx} style={cardStyle}>{num}</div>
      ))}
    </div>
  </div>
);

export default GameTable;
