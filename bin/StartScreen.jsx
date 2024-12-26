import React from "react";

const StartScreen = ({ onStart, onAbout }) => (
  <div
    style={{
      width: "100%",
      height: "100vh",
      color: "white",
      textAlign: "center",
      paddingTop: "20vh",
      backgroundImage: 'url("main_background.svg")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <p
      style={{
        margin: 0,
        padding: "0 10%",
        fontFamily: "Arial",
        fontSize: "4vw",
        fontWeight: "bold",
        maxWidth: "90%",
        textAlign: "center",
      }}
    >
      Берлога: Космическая доставка
    </p>
    <p
      style={{
        margin: 0,
        padding: "0 10%",
        fontFamily: "Arial",
        fontSize: "2vw",
        fontWeight: "bold",
        maxWidth: "90%",
        textAlign: "center",
      }}
    >
      Покажи мастерство мягкой посадки!
    </p>
    <div
      style={{
        display: "flex",
        gap: "10px",
        marginTop: "5vh",
        flexWrap: "wrap",
      }}
    >
      <button
        onClick={() => {
          onStart();
          //audio.Init();
        }}
        style={{
          minWidth: "200px",
          width: "20vw",
          maxWidth: "400px",
          fontSize: "2vw",
          fontWeight: "bold",
          padding: "2vh 3vw",
          //background: "linear-gradient(145deg, #4c435e, #B67C8A)",
          background: "linear-gradient(145deg, #48416b, #4c435e)",
          color: "#fff",
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
            "linear-gradient(145deg, #48416b, #4c435e))";
          e.target.style.transform = "scale(1)";
        }}
      >
        Начать игру
      </button>
      <button
        onClick={() => {
          onAbout();
        }}
        style={{
          minWidth: "100px",
          width: "10vw",
          maxWidth: "200px",
          fontSize: "2vw",
          fontWeight: "bold",
          padding: "2vh 3vw",
          //background: "linear-gradient(145deg, #4c435e, #B67C8A)",
          background: "linear-gradient(145deg, #48416b, #4c435e)",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) => {
          e.target.style.background =
            //"linear-gradient(145deg, #B67C8A, #4c435e)";
            "linear-gradient(145deg, #4c435e, #48416b)";
          e.target.style.transform = "scale(1.05)";
        }}
        onMouseOut={(e) => {
          e.target.style.background =
            //"linear-gradient(145deg, #4c435e, #B67C8A)";
            "linear-gradient(145deg, #48416b, #4c435e)";
          e.target.style.transform = "scale(1)";
        }}
      >
        ?
      </button>
    </div>
  </div>
);

export default StartScreen;
