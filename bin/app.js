import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import StartScreen from './StartScreen';
import GameScreen from './GameScreen';

const App = () => {
  const [isGameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    setGameStarted(true);
  };

  return (
    <div>
      {isGameStarted ? (
        <GameScreen />
      ) : (
        <StartScreen onStart={startGame} />
      )}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
