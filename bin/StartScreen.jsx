import React from 'react';

const StartScreen = ({ onStart }) => (
  <div style={{ color: 'white', textAlign: 'center', marginTop: '20%' }}>
    <h1>Interplanetary Postal Service</h1>
    <button onClick={onStart} style={{ fontSize: '24px', padding: '10px 20px' }}>
      Начать игру
    </button>
  </div>
);

export default StartScreen;
