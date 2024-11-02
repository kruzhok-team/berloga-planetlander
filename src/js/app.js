import React, { useState } from "react";
import ReactDOM from "react-dom";
import StartScreen from "./StartScreen";
import GameScreen from "./GameScreen";
import LevelsScreen from "./LevelsScreen";
import FinishScreen from "./FinishScreen";
import AboutScreen from "./AboutScreen";

const App = () => {
  const [screen, setScreen] = useState(0);
  const [levelId, setLevelId] = useState(1);
  const [win, setWin] = useState(false);

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
  const startFinishScreen = () => {
    setScreen(3);
  };
  const startAboutScreen = () => {
    setScreen(4);
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
            setWin(false);
            startFinishScreen();
          }}
          onWin={() => {
            setWin(true);
            startFinishScreen();
          }}
        />
      ) : screen === 3 ? (
        <FinishScreen onNext={StartStartScreen} win={win} />
      ) : (
        <AboutScreen onBack={StartStartScreen} />
      )}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
