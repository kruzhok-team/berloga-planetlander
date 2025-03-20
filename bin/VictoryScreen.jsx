import React from "react";

const VictoryScreen = ({ onBackToMain }) => (
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
        Победа!
      </h1>
      <p style={{ fontSize: "18px", lineHeight: "1.5", color: "#e0e0e0" }}>
        Поздравляем! Вы успешно завершили уровень. Отличная работа! Теперь вы
        можете вернуться на главный экран, чтобы выбрать другой уровень или
        попробовать пройти этот снова.
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
        background: "linear-gradient(145deg, #48416b, #4c435e)",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        transition: "all 0.3s ease",
      }}
      onMouseOver={(e) => {
        e.target.style.background = "linear-gradient(145deg, #4c435e, #48416b)";
        e.target.style.transform = "scale(1.05)";
      }}
      onMouseOut={(e) => {
        e.target.style.background = "linear-gradient(145deg, #48416b, #4c435e)";
        e.target.style.transform = "scale(1)";
      }}
    >
      Вернуться на главный экран
    </button>
  </div>
);

export default VictoryScreen;
