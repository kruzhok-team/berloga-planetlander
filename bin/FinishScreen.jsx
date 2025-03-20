import React from 'react';

const FinishScreen = ({onNext, win}) => (
  <div style={{ color: 'white', textAlign: 'center', marginTop: '20%' }}>
    {win ? (
      <h1>You win</h1>
    ) : (
      <h1>You lose</h1>
    )}
    <button onClick={() => {
      onNext();
    }}>Next</button>
  </div>
);

export default FinishScreen;
