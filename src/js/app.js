import React, { useState } from "react";
import ReactDOM from "react-dom";
import StartScreen from "./StartScreen";
import GameScreen from "./GameScreen";
import LevelsScreen from "./LevelsScreen";
import DefeatScreen from "./DefeatScreen";
import AboutScreen from "./AboutScreen";
import VictoryScreen from "./VictoryScreen";

const App = () => {
  const [screen, setScreen] = useState(0);
  const [levelId, setLevelId] = useState(1);

  const StartStartScreen = () => {
    setScreen(0);
  };
  const startGame = (levelId) => {
    setLevelId(levelId);
    setScreen(2);
  };
  const startLevels = () => {
    setScreen(1);
  };
  const startDefeatScreen = () => {
    setScreen(3);
  };
  const startAboutScreen = () => {
    setScreen(4);
  };
  const startVictoryScreen = () => {
    setScreen(5);
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {screen === 0 ? (
        <StartScreen onStart={startLevels} onAbout={startAboutScreen} />
      ) : screen === 1 ? (
        <LevelsScreen onLevelSelect={startGame} />
      ) : screen === 2 ? (
        <GameScreen
          levelNumber={levelId}
          onLose={() => {
            startDefeatScreen();
          }}
          onWin={() => {
            startVictoryScreen();
          }}
        />
      ) : screen === 3 ? (
        <DefeatScreen onBackToMain={StartStartScreen} />
      ) : screen === 4 ? (
        <AboutScreen onBack={StartStartScreen} />
      ) : (
        <VictoryScreen onBackToMain={StartStartScreen} />
      )}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
