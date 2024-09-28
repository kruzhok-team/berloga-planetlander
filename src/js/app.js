import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import StartScreen from './StartScreen';

const App = () => {
  const [isGameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    setGameStarted(true);
    Main(); // Вызываем функцию запуска игры
  };

  return (
    <div>
      {isGameStarted ? (
        <>
          <canvas id="fluidcanvas" width="256" height="128" style={{ zIndex: 1 }}></canvas>
          <canvas id="overlaycanvas" width="1024" height="512" style={{ zIndex: 2 }}></canvas>
          <svg id="svg" viewBox="0 0 256 128" style={{ zIndex: 3 }}>
            {/* Остальная разметка SVG */}
          </svg>
        </>
      ) : (
        <StartScreen onStart={startGame} />
      )}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
