import React, { useState } from "react";
import ReactDOM from "react-dom";
import StartScreen from "./StartScreen";
import GameScreen from "./GameScreen";
import LevelsScreen from "./LevelsScreen";
import DefeatScreen from "./DefeatScreen";
import AboutScreen from "./AboutScreen";
import VictoryScreen from "./VictoryScreen";
import CutsceneScreen from "./CutsceneScreen";
import LevelManager from "./progress.jsx";

const levelsInit = [
  {
    id: 1,
    name: "Берлога",
    x: 400,
    y: 600,
    children: [2],
    image: "./images/berloga.png",
  },
  {
    id: 2,
    name: "Берлога",
    x: 600,
    y: 500,
    children: [3],
    image: "./images/berloga.png",
    //image: "image1.png",
  },
  {
    id: 3,
    name: "Берлога",
    x: 700,
    y: 450,
    children: [4],
    image: "./images/berloga.png",

    //image: "image2.png",
  },
  {
    id: 4,
    name: "Берлога",
    x: 825,
    y: 525,
    children: [5],
    image: "./images/berloga.png",

    //image: "image3.png",
  },
  {
    id: 5,
    name: "Цетос",
    x: 925,
    y: 575,
    children: [6],
    image: "./images/cetos.png",
    //image: "image4.png",
  },
  {
    id: 6,
    name: "Цетос",
    x: 1150,
    y: 575,
    children: [7],
    image: "./images/cetos.png",
    //image: "image5.png",
  },
  {
    id: 7,
    name: "Цетос",
    x: 1125,
    y: 725,
    children: [8],
    image: "./images/cetos.png",

    //image: "image6.png",
  },
  {
    id: 8,
    name: "Тетис",
    x: 950,
    y: 700,
    children: [],
    image: "./images/tetic.png",
    //image: "image7.png",
  },
];

const App = () => {
  const [screen, setScreen] = useState(0);
  const [levelId, setLevelId] = useState(1);
  const levelManager = new LevelManager(levelsInit);

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
          levelD={levelManager.getAllLevels()}
        />
      ) : screen === 2 ? (
        <GameScreen
          levelNumber={levelId}
          onLose={() => {
            startDefeatScreen();
          }}
          onWin={() => {
            startVictoryScreen();
            levelManager.setCompleteStatus(levelId, true);
          }}
        />
      ) : screen === 3 ? (
        <DefeatScreen onBackToMain={startLevels} />
      ) : screen === 4 ? (
        <AboutScreen onBack={StartStartScreen} />
      ) : screen === 5 ? (
        <VictoryScreen onBackToMain={startLevels} />
      ) : (
        <CutsceneScreen
          level={levelId}
          onBack={startLevels}
          onNext={startGame}
        />
      )}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
