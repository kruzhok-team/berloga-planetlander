import React from "react";

const StartScreen = ({ onStart }) => (
  <div
    style={{
      width: "100%",
      height: "100%",
      color: "white",
      textAlign: "center",
      paddingTop: "22%",
      backgroundImage: 'url("main_background.png")',
    }}
  >
    <p
      style={{
        paddingLeft: "15%",
        fontFamily: "Arial",
        fontSize: "44px",
        fontWeight: "bold",
      }}
    >
      Interplanetary Postal Service
    </p>
    <button
      onClick={() => {
        onStart();
        audio.Init();
      }}
      style={{
        width: "400px",
        marginTop: "15%",
        fontSize: "24px",
        fontWeight: "bold",
        padding: "20px 35px",
        background: "linear-gradient(145deg, #48416b, #4c435e)",
        color: "#fff",
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
      Начать игру
    </button>
    <button
      onClick={() => {
        onStart();
        audio.Init();
      }}
      style={{
        marginLeft: "10px",
        marginTop: "15%",
        fontSize: "24px",
        fontWeight: "bold",
        padding: "20px 35px",
        background: "linear-gradient(145deg, #48416b, #4c435e)",
        color: "#fff",
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
      ?
    </button>
  </div>
);

export default StartScreen;
