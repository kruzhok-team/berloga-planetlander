import React, { useState } from "react";
import ReactDOM from "react-dom";
import StartScreen from "./StartScreen";
import GameScreen from "./GameScreen";
import LevelsScreen from "./LevelsScreen";
import DefeatScreen from "./DefeatScreen";
import AboutScreen from "./AboutScreen";
import VictoryScreen from "./VictoryScreen";
import CutsceneScreen from "./CutsceneScreen";

const App = () => {
  const [screen, setScreen] = useState(0);
  const [levelId, setLevelId] = useState(1);

  const StartStartScreen = () => {
    setScreen(0);
  };
  const startCutsceneScreen = (levelId) => {
    setLevelId(levelId);
    setScreen(6);
  };
  const startGame = () => {
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
        <LevelsScreen
          onLevelSelect={startCutsceneScreen}
          onBack={StartStartScreen}
        />
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
      ) : screen === 5 ? (
        <VictoryScreen onBackToMain={StartStartScreen} />
      ) : (
        <CutsceneScreen
          level={levelId}
          onBack={StartStartScreen}
          onNext={startGame}
        />
      )}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
