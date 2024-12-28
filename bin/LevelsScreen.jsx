import React, { useState, useEffect } from "react";

let levelsData = [];

const getLevelById = (id) => {
  return levelsData.find((level) => level.id === id);
};

const renderLines = (level) => {
  return level.children.map((childId) => {
    const childLevel = getLevelById(childId);

    if (!childLevel) {
      console.warn(`Child level with ID ${childId} not found.`);
      return null; // Если дочерний уровень не найден, пропускаем
    }

    return (
      <line
        key={`line-${level.id}-${childId}`}
        x1={`${level.x}%`} // Используем проценты для адаптивности
        y1={`${level.y}%`}
        x2={`${childLevel.x}%`}
        y2={`${childLevel.y}%`}
        stroke="rgba(255, 255, 255, 0.3)"
        strokeWidth="0.5%" // Относительная ширина для адаптивности
      />
    );
  });
};

//const renderLines = (level) => {
//  const lines = [];
//  level.children.forEach((childId) => {
//    const childLevel = getLevelById(childId);
//    lines.push(
//      <line
//        key={`line-${level.id}-${childId}`}
//        x1={level.x}
//        y1={level.y}
//        x2={childLevel.x}
//        y2={childLevel.y}
//        stroke="rgba(255, 255, 255, 0.3)"
//        strokeWidth="2"
//      />,
//    );
//  });
//  return lines;
//};

function Resize() {
  //document.getElementById("svglevels").width = window.innerHeight;
  //document.getElementById("svglevels").height = window.innerHeight;
  document
    .getElementById("svglevels")
    .setAttribute(
      "style",
      "view-box: 0 0 " +
        window.innerHeight +
        " " +
        window.innerHeight +
        "; width: " +
        window.innerHeight +
        " px; height: " +
        window.innerHeight +
        " px;",
    );
}

async function res() {
  Resize();
  window.addEventListener("resize", () => Resize());
}

const LevelScreen = ({ onLevelSelect, onBack, levelD }) => {
  levelsData = levelD;
  console.log(levelD);

  const [activeLevelId, setActiveLevelId] = useState(null);

  useEffect(() => {
    // Выполнить Resize при монтировании компонента
    Resize();

    // Добавить слушатель события изменения размера окна
    const handleResize = () => Resize();
    window.addEventListener("resize", handleResize);

    // Удалить слушатель при размонтировании компонента
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
          padding: "20px",
          flex: 1,
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center", // Центровка SVG
          alignItems: "center", // Вертикальная центровка SVG
        }}
      >
        <svg
          id="svglevels"
          width="100%"
          height="100%"
          //viewBox="0 0 1000 1000" // Установите виртуальные размеры для масштабирования
          preserveAspectRatio="xMidYMid meet"
          style={{
            padding: "20px",
          }}
        >
          {levelsData.map((level) => {
            const isActive = level.id === activeLevelId;
            const size = isActive ? 9 : 8; // Размеры как проценты от viewBox
            return (
              <React.Fragment key={level.id}>
                <g
                  onClick={
                    level.lock ? () => {} : () => onLevelSelect(level.id)
                  }
                  onMouseEnter={() => setActiveLevelId(level.id)}
                  onMouseLeave={() => setActiveLevelId(null)}
                  style={{
                    cursor: level.lock ? "not-allowed" : "pointer",
                  }}
                >
                  <image
                    href={level.lock ? "./images/lock.svg" : level.image}
                    x={`${level.x - size / 2}%`} // Расчет позиций в процентах
                    y={`${level.y - size / 2}%`}
                    width={`${size}%`}
                    height={`${size}%`}
                  />
                  <text
                    x={`${level.x}%`}
                    y={`${level.y + size - 2}%`}
                    fontSize="115%"
                    fill="white"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {level.name}
                  </text>
                  <text
                    x={`${level.x}%`}
                    y={`${level.y + size + 1}%`}
                    fontSize="115%"
                    fill="white"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {level.desc}
                  </text>
                </g>
                {renderLines(level)}
              </React.Fragment>
            );
          })}
        </svg>

        {/*<svg width="100%" height="100%" style={{}}>
          {levelsData.map((level) => {
            const isActive = level.id === activeLevelId;
            return (
              <React.Fragment key={level.id}>
                <g
                  onClick={
                    level.lock ? () => {} : () => onLevelSelect(level.id)
                  }
                  onMouseEnter={() => setActiveLevelId(level.id)}
                  onMouseLeave={() => setActiveLevelId(null)}
                  style={{
                    cursor: "pointer",
                  }}
                >
                  <image
                    href={level.lock ? "./images/lock.svg" : level.image} // Адрес картинки
                    x={level.x - 30} // Фиксированный центр
                    y={level.y - 30}
                    width={isActive ? 70 : 60} // Базовый размер
                    height={isActive ? 70 : 60}
                  />
                  <text
                    x={level.x}
                    y={level.y + 50} // Смещаем ниже изображения
                    fontSize="16"
                    fill="white"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {level.id}
                  </text>
                  <text
                    x={level.x}
                    y={level.y + 70} // Смещаем ниже номера
                    fontSize="14"
                    fill="white"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {level.name}
                  </text>
                </g>
                {renderLines(level)}
              </React.Fragment>
            );
          })}
        </svg>*/}
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
