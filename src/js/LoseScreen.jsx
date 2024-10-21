import React from 'react';

const LoseScreen = ({onNext}) => (
  <div style={{ color: 'white', textAlign: 'center', marginTop: '20%' }}>
    <h1>You lose</h1>
    <button onClick={onNext}>Next</button>
  </div>
);

export default LoseScreen;
