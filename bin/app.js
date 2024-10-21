import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import StartScreen from './StartScreen';
import GameScreen from './GameScreen';
import LevelsScreen from './LevelsScreen';
import LoseScreen from './LoseScreen';

const App = () => {
  const [screen, setScreen] = useState(0);
  const [levelId, setLevelId] = useState(1);

  const StartStartScreen = () => {
    setScreen(0);
  }
  const startGame = (levelId) => {
    setLevelId(levelId);
    setScreen(2);
  };
  const startLevels = () => {
    setScreen(1);
  };
  const startLoseScreen = () => {
    setScreen(3);
  }

  return (
    <div>
      {screen === 0 ? (
        <StartScreen onStart={startLevels} />
      ) : screen === 1 ? (
        <LevelsScreen onClickLevel={startGame} />
      ) : screen === 2 ? (
        <GameScreen levelNumber={levelId} onLose={startLoseScreen}/>
      ) : (
        <LoseScreen onNext={StartStartScreen} />
      )}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
