import React, { useState, useEffect } from "react";

const CutsceneScreen = ({ level, onBack, onNext }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isTextTyping, setIsTextTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [textIndex, setTextIndex] = useState(0);

  const cutscenes = [
    {
      level: 1,
      character: "Медведь 1",
      text: [
        "Привет, команда! Мы готовы начать доставку на этом уровне.",
        "Смотрите, какое красивое место для посадки! Нужно быть осторожными.",
      ],
      imageUrl: "placeholder_bear1.png",
    },
    {
      level: 2,
      character: "Медведь 2",
      text: [
        "Эта планета опасна! Нужно аккуратно двигаться.",
        "Не забывайте следить за уровнем топлива!",
      ],
      imageUrl: "placeholder_bear2.png",
    },
    {
      level: 3,
      character: "Медведь 3",
      text: [
        "Мы уже близко к финишу! Но путь будет сложным.",
        "Не упустите шанс заработать дополнительные очки!",
      ],
      imageUrl: "placeholder_bear3.png",
    },
    {
      level: 4,
      character: "Медведь 3",
      text: [
        "Мы уже близко к финишу! Но путь будет сложным.",
        "Не упустите шанс заработать дополнительные очки!",
      ],
      imageUrl: "placeholder_bear3.png",
    },

    {
      level: 5,
      character: "Медведь 3",
      text: [
        "Мы уже близко к финишу! Но путь будет сложным.",
        "Не упустите шанс заработать дополнительные очки!",
      ],
      imageUrl: "placeholder_bear3.png",
    },
    {
      level: 6,
      character: "Медведь 3",
      text: [
        "Мы уже близко к финишу! Но путь будет сложным.",
        "Не упустите шанс заработать дополнительные очки!",
      ],
      imageUrl: "placeholder_bear3.png",
    },
    {
      level: 7,
      character: "Медведь 3",
      text: [
        "Мы уже близко к финишу! Но путь будет сложным.",
        "Не упустите шанс заработать дополнительные очки!",
      ],
      imageUrl: "placeholder_bear3.png",
    },
    {
      level: 8,
      character: "Медведь 3",
      text: [
        "Мы уже близко к финишу! Но путь будет сложным.",
        "Не упустите шанс заработать дополнительные очки!",
      ],
      imageUrl: "placeholder_bear3.png",
    },
  ];

  const currentCutscene = cutscenes.find((scene) => scene.level === level);

  // Функция для печати текста с эффектом набора
  const startTypingText = () => {
    setIsTextTyping(true);
    let charIndex = 0;
    const currentText = currentCutscene.text[currentTextIndex];

    const typingInterval = setInterval(() => {
      setDisplayedText((prevText) => {
        const nextChar = currentText[charIndex];
        charIndex += 1;
        return prevText + nextChar;
      });

      if (charIndex === currentText.length) {
        clearInterval(typingInterval);
        setIsTextTyping(false);
      }
    }, 100);
  };

  // Используем useEffect для начала печати текста при смене индекса реплики
  useEffect(() => {
    if (currentTextIndex < currentCutscene.text.length) {
      setDisplayedText("");
      startTypingText();
    }
  }, [currentTextIndex]);

  // Функция для перехода к следующей реплике
  const handleNextText = () => {
    if (!isTextTyping) {
      if (currentTextIndex < currentCutscene.text.length - 1) {
        setCurrentTextIndex(currentTextIndex + 1);
      } else {
        onNext();
      }
    }
  };

  // Обрабатываем нажатие клавиши для перехода к следующей реплике
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Enter") {
        handleNextText();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [currentTextIndex, isTextTyping]);

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
        justifyContent: "center",
        position: "relative",
      }}
      onClick={handleNextText} // обработка клика для следующей реплики
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
        {/* Кат-сцена */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            width: "100%",
          }}
        >
          {/* Карточка с репликой и изображением */}
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
              {currentCutscene.character}
            </h2>
            <p
              style={{ fontSize: "18px", lineHeight: "1.5", color: "#e0e0e0" }}
            >
              {displayedText}
            </p>
          </div>

          {/* Изображение медведя */}
          <div
            style={{
              flex: 1,
              padding: "20px",
              borderRadius: "15px",
              border: "2px solid rgba(255, 255, 0, 0.3)",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              boxSizing: "border-box",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img
              src={currentCutscene.imageUrl}
              alt="Медведь"
              style={{ maxWidth: "100%", borderRadius: "10px" }}
            />
          </div>
        </div>
      </div>

      {/* Контейнер для кнопок */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "1000px", // Задаем максимальную ширину
          marginTop: "20px", // Отступ сверху для кнопок
        }}
      >
        {/* Кнопка Назад */}
        <button
          onClick={onBack}
          style={{
            width: "calc(50% - 10px)", // Ширина кнопки 50% от контейнера
            padding: "15px",
            fontSize: "16px",
            color: "white",
            background: "linear-gradient(145deg, #48416b, #4c435e)",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            outline: "none",
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

        {/* Кнопка Продолжить */}
        <button
          onClick={handleNextText}
          style={{
            width: "calc(50% - 10px)", // Ширина кнопки 50% от контейнера
            padding: "15px",
            fontSize: "16px",
            color: "white",
            background: "linear-gradient(145deg, #48416b, #4c435e)",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            outline: "none",
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
          Продолжить
        </button>
      </div>
    </div>
  );
};

export default CutsceneScreen;
