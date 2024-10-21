import React, { useEffect } from 'react';

const GameScreen = ({levelNumber, onLose}) => {
  useEffect(() => {
    Main(levelNumber, onLose);
  }, []);

  return (
    <div>
      <script src="audio.js"></script>
      <script src="game.js"></script>
      <script src="level.js"></script>
      <canvas id="fluidcanvas" width="256" height="128" style={{ zIndex: 1 }}></canvas>
      <canvas id="overlaycanvas" width="1024" height="512" style={{ zIndex: 2 }}></canvas>

      <svg id="svg" viewBox="0 0 256 128" style={{ zIndex: 3 }}>
        <text id="timertext" textAnchor="middle" x="128" y="64"></text>
        <text id="leveltext" style={{ fontSize: '20px' }} textAnchor="middle" x="128" y="124"></text>
        <text id="info" x="1" y="4" style={{ fill: 'rgba(255,255,255)' }}></text>
        <g id="fuelbar">
          <rect x="5" y="20" width="10" height="70" style={{ fill: 'rgba(255,255,255,0.5)', strokeWidth: 0.5, stroke: 'rgb(0,0,0)' }}></rect>
          <rect id="fuel" x="5" y="20" width="10" height="70" style={{ fill: 'rgba(50,50,100,0.8)', strokeWidth: 0 }}></rect>
          <text x="7.5" y="25" style={{ fontSize: '5px' }}>⛽</text>
        </g>
        <text id="shipsleft" x="5" y="18" style={{ fill: 'rgba(255,255,255)' }}></text>

        <g id="velocitybar">
          <rect x="240" y="10" width="5" height="100" style={{ fill: 'rgba(255,255,255,0.2)', strokeWidth: 0.5, stroke: 'rgb(0,0,0)' }}></rect>
          <rect x="240" y="60" width="5" height="10" style={{ fill: 'rgba(0,255,0,0.8)', strokeWidth: 0 }}></rect>
          <text x="236" y="62" style={{ fontSize: '5px' }}>0</text>
          <g className="v">
            {[...Array(25)].map((_, index) => (
              <line key={index} x1="240" y1={15 + index * 5} x2="242" y2={15 + index * 5} />
            ))}
          </g>
          <line id="velocity" x1="240" y1="60" x2="245" y2="60" style={{ stroke: 'rgb(255,255,255)', strokeWidth: 1 }} />
        </g>
      </svg>
    </div>
  );
};

export default GameScreen;
