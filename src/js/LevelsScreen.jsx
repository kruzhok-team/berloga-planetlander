import React from 'react';

const StartScreen = ({ onClickLevel }) => (
  <div style={{ color: 'white', textAlign: 'center', marginTop: '20%' }}>
    <h1>Levels</h1>
    <button onClick={() => onClickLevel(1)} style={{ fontSize: '24px', padding: '10px 20px' }}>
      1
    </button>
    <button onClick={() => onClickLevel(2)} style={{ fontSize: '24px', padding: '10px 20px' }}>
      2
    </button>
    <button onClick={() => onClickLevel(3)} style={{ fontSize: '24px', padding: '10px 20px' }}>
      3
    </button>
    <button onClick={() => onClickLevel(4)} style={{ fontSize: '24px', padding: '10px 20px' }}>
      4
    </button>
    <button onClick={() => onClickLevel(5)} style={{ fontSize: '24px', padding: '10px 20px' }}>
      5
    </button>
    <button onClick={() => onClickLevel(6)} style={{ fontSize: '24px', padding: '10px 20px' }}>
      6
    </button>
    <button onClick={() => onClickLevel(7)} style={{ fontSize: '24px', padding: '10px 20px' }}>
      7
    </button>
    <button onClick={() => onClickLevel(8)} style={{ fontSize: '24px', padding: '10px 20px' }}>
      8
    </button>
  </div>
);

export default StartScreen;
