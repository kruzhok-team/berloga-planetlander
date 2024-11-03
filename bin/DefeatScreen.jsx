import React from "react";

const DefeatScreen = ({ onBackToMain }) => (
  <div
    style={{
      width: "100%",
      height: "100vh",
      color: "white",
      textAlign: "center",
      backgroundImage: 'url("main_background.png")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      fontFamily: "Arial, sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      gap: "20px",
      padding: "20px",
    }}
  >
    <div
      style={{
        width: "90%",
        maxWidth: "800px",
        padding: "20px",
        borderRadius: "15px",
        border: "2px solid rgba(255, 255, 255, 0.3)",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        boxSizing: "border-box",
      }}
    >
      <h1
        style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "20px" }}
      >
        Поражение
      </h1>
      <p style={{ fontSize: "18px", lineHeight: "1.5", color: "#e0e0e0" }}>
        К сожалению, вы не смогли завершить уровень. Не сдавайтесь! Попробуйте
        снова, ведь практика ведет к успеху.
      </p>
    </div>

    {/* Кнопка для возврата на главный экран */}
    <button
      onClick={() => {
        onBackToMain();
      }}
      style={{
        width: "90%",
        maxWidth: "800px",
        padding: "15px 0",
        fontSize: "18px",
        color: "white",
        background: "linear-gradient(145deg, #6b4141, #5e4343)", // Оттенки красного для эффекта поражения
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        transition: "all 0.3s ease",
      }}
      onMouseOver={(e) => {
        e.target.style.background = "linear-gradient(145deg, #5e4343, #6b4141)";
        e.target.style.transform = "scale(1.05)";
      }}
      onMouseOut={(e) => {
        e.target.style.background = "linear-gradient(145deg, #6b4141, #5e4343)";
        e.target.style.transform = "scale(1)";
      }}
    >
      Вернуться на главный экран
    </button>
  </div>
);

export default DefeatScreen;
