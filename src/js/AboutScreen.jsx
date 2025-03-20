import React from "react";

const AboutScreen = ({ onBack }) => (
  <div
    style={{
      width: "100%",
      height: "100vh",
      color: "white",
      textAlign: "center",
      backgroundImage: 'url("background4.svg")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      fontFamily: "Arial, sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    }}
  >
    <div
      style={{
        width: "90%",
        maxWidth: "1000px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      {/* Первый ряд - первая плашка */}
      <div
        style={{
          width: "100%",
          padding: "20px",
          borderRadius: "15px",
          border: "2px solid rgba(255, 255, 255, 0.3)",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          boxSizing: "border-box",
        }}
      >
        <h2
          style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}
        >
          Межпланетная почта
        </h2>
        <p style={{ fontSize: "18px", lineHeight: "1.5", color: "#e0e0e0" }}>
          Ура! Вы попали на стажировку в Службу доставки Отряда Первопроходцев.
          Ваша задача — экстренная доставка на обитаемые планеты необходимых
          запчастей и медикаментов. Корабль надёжен и готов к посадке в сложных
          условиях. Следите за уровнем топлива, чтобы корабль не рухнул, и за
          скоростью, чтобы не разбиться. Учитывайте атмосферные явления. Удачи!
        </p>
      </div>

      {/* Второй ряд - две плашки */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          width: "100%",
        }}
      >
        {/* Вторая плашка */}
        <div
          style={{
            flex: 1,
            padding: "20px",
            borderRadius: "15px",
            border: "2px solid rgba(255, 255, 255, 0.3)",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            boxSizing: "border-box",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            Управление
          </h2>
          <p style={{ fontSize: "18px", lineHeight: "1.5", color: "#e0e0e0" }}>
            W - Вверх
          </p>
          <p style={{ fontSize: "18px", lineHeight: "1.5", color: "#e0e0e0" }}>
            A - Влево
          </p>
          <p style={{ fontSize: "18px", lineHeight: "1.5", color: "#e0e0e0" }}>
            S - Вниз
          </p>
          <p style={{ fontSize: "18px", lineHeight: "1.5", color: "#e0e0e0" }}>
            D - Вправо
          </p>
          <p style={{ fontSize: "18px", lineHeight: "1.5", color: "#e0e0e0" }}>
            Пробел (Space) - Выключить / Включить звук
          </p>
        </div>

        {/* Третья плашка */}
        <div
          style={{
            flex: 1,
            padding: "20px",
            borderRadius: "15px",
            border: "2px solid rgba(255, 255, 255, 0.3)",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            boxSizing: "border-box",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            НКФП Берлога
          </h2>
          <p style={{ fontSize: "18px", lineHeight: "1.5", color: "#e0e0e0" }}>
            Национальная киберфизическая платформа «Берлога» — полезные игры о
            медведях с планеты Берлога помогают получить навыки в сфере
            технологий.
          </p>
        </div>
      </div>

      {/* Третий ряд - кнопка Назад */}
      <div
        style={{
          width: "100%",
          padding: "20px",
          borderRadius: "15px",
          display: "flex",
          justifyContent: "center",
          boxSizing: "border-box",
        }}
      >
        <button
          onClick={onBack}
          style={{
            width: "100%",
            padding: "15px",
            fontSize: "16px",
            color: "white",
            background: "linear-gradient(145deg, #48416b, #4c435e)",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            transition: "all 0.3s ease",
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
    </div>
  </div>
);

export default AboutScreen;
