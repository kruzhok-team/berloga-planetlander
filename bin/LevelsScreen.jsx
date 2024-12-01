import React, { useState } from "react";

const levelsData = [
  {
    id: 1,
    name: "Уровень 1",
    x: 100,
    y: 500,
    children: [2],
    image: "image1.png",
  },
  {
    id: 2,
    name: "Уровень 2",
    x: 200,
    y: 400,
    children: [3],
    image: "image2.png",
  },
  {
    id: 3,
    name: "Уровень 3",
    x: 200,
    y: 600,
    children: [4],
    image: "image3.png",
  },
  {
    id: 4,
    name: "Уровень 4",
    x: 300,
    y: 400,
    children: [5],
    image: "image4.png",
  },
  {
    id: 5,
    name: "Уровень 5",
    x: 300,
    y: 600,
    children: [6],
    image: "image5.png",
  },
  {
    id: 6,
    name: "Уровень 6",
    x: 400,
    y: 400,
    children: [7],
    image: "image6.png",
  },
  {
    id: 7,
    name: "Уровень 7",
    x: 400,
    y: 600,
    children: [8],
    image: "image7.png",
  },
  {
    id: 8,
    name: "Уровень 8",
    x: 500,
    y: 600,
    children: [],
    image: "image8.png",
  },
];

const getLevelById = (id) => {
  return levelsData.find((level) => level.id === id);
};

const renderLines = (level) => {
  const lines = [];
  level.children.forEach((childId) => {
    const childLevel = getLevelById(childId);
    lines.push(
      <line
        key={`line-${level.id}-${childId}`}
        x1={level.x}
        y1={level.y}
        x2={childLevel.x}
        y2={childLevel.y}
        stroke="rgba(255, 255, 255, 0.3)"
        strokeWidth="2"
      />,
    );
  });
  return lines;
};
const LevelScreen = ({ onLevelSelect, onBack }) => {
  const [activeLevelId, setActiveLevelId] = useState(null);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        color: "white",
        textAlign: "center",
        backgroundImage: 'url("main_background.svg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          flex: 1,
          position: "relative",
          width: "100%",
          display: "flex",
          justifyContent: "center", // Центровка SVG
          alignItems: "center", // Вертикальная центровка SVG
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 800 800" // Задаем фиксированный размер для точной центровки
          style={{
            maxWidth: "800px", // Ограничиваем максимальную ширину SVG
            maxHeight: "800px", // Ограничиваем максимальную высоту SVG
          }}
        >
          {levelsData.map((level) => {
            const isActive = level.id === activeLevelId;

            return (
              <React.Fragment key={level.id}>
                <g
                  onClick={() => onLevelSelect(level.id)}
                  onMouseEnter={() => setActiveLevelId(level.id)}
                  onMouseLeave={() => setActiveLevelId(null)}
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <circle
                    cx={level.x}
                    cy={level.y}
                    r={isActive ? 40 : 30}
                    fill="rgba(255, 255, 255, 0.1)"
                    stroke="rgba(255, 255, 255, 0.5)"
                    strokeWidth="2"
                    style={{
                      transition: "r 0.3s ease-in-out",
                    }}
                  />
                  <text
                    x={level.x}
                    y={level.y + 5}
                    fontSize="16"
                    fill="white"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {level.id}
                  </text>
                </g>
                {renderLines(level)}
              </React.Fragment>
            );
          })}
        </svg>
      </div>
      <button
        onClick={onBack}
        style={{
          width: "80%",
          padding: "15px",
          fontSize: "16px",
          color: "white",
          background: "linear-gradient(145deg, #48416b, #4c435e)",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          transition: "all 0.3s ease",
          margin: "10px 0",
        }}
        onMouseOver={(e) => {
          e.target.style.background =
            "linear-gradient(145deg, #4c435e, #48416b)";
          e.target.style.transform = "scale(1.05)";
        }}
        onMouseOut={(e) => {
          e.target.style.background =
            "linear-gradient(145deg, #48416b, #4c435e)";
          e.target.style.transform = "scale(1)";
        }}
      >
        Назад
      </button>
    </div>
  );
};

export default LevelScreen;

//const LevelScreen = ({ onLevelSelect }) => {
//  const [activeLevelId, setActiveLevelId] = useState(null);
//
//  return (
//    <div
//      style={{
//        width: "100%",
//        height: "100vh",
//        color: "white",
//        textAlign: "center",
//        backgroundImage: 'url("main_background.svg")',
//        backgroundSize: "cover",
//        backgroundPosition: "center",
//        fontFamily: "Arial, sans-serif",
//        display: "flex",
//        alignItems: "center",
//        justifyContent: "center",
//        position: "relative",
//      }}
//    >
//      <svg width="100%" height="100%">
//        {levelsData.map((level) => {
//          const isActive = level.id === activeLevelId;
//
//          return (
//            <React.Fragment key={level.id}>
//              <g
//                onClick={() => onLevelSelect(level.id)}
//                onMouseEnter={() => setActiveLevelId(level.id)}
//                onMouseLeave={() => setActiveLevelId(null)}
//                style={{
//                  cursor: "pointer",
//                }}
//              >
//                <circle
//                  cx={level.x}
//                  cy={level.y}
//                  r={isActive ? 40 : 30}
//                  fill="rgba(255, 255, 255, 0.1)"
//                  stroke="rgba(255, 255, 255, 0.5)"
//                  strokeWidth="2"
//                  style={{
//                    transition: "r 0.3s ease-in-out",
//                  }}
//                />
//                {/* Добавляем изображение */}
//                {/*<image
//                  href={level.image}
//                  x={level.x - 25} // Центрируем изображение
//                  y={level.y - 25}
//                  width="50" // Ширина изображения
//                  height="50" // Высота изображения
//                />*/}
//                {/* Добавляем номер уровня */}
//                <text
//                  x={level.x}
//                  y={level.y + 5} // Смещение по оси Y для центрирования текста
//                  fontSize="16"
//                  fill="white"
//                  textAnchor="middle"
//                  dominantBaseline="middle"
//                >
//                  {level.id}
//                </text>
//              </g>
//              {renderLines(level)}
//            </React.Fragment>
//          );
//        })}
//      </svg>
//    </div>
//  );
//};
//
//export default LevelScreen;
