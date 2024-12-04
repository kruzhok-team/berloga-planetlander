import React, { useState, useEffect, useRef } from "react";

const CutsceneScreen = ({ level, onBack, onNext }) => {
  const cutscenes = [
    {
      level: 1,
      text: [
        {
          character: "Капитан Сайда",
          imageUrl: "./images/captain.png",
          text: "Привет, пилот! Я капитан Сайда, буду помогать тебе и направлять на давать задания. А это бортовой компьютер, он будет сопровождать тебя на миссиях",
        },
        {
          character: "Бортовой компьютер",
          imageUrl: "./images/bort.png",
          text: "Добрый день!",
        },
        {
          character: "Пилот",
          imageUrl: "./images/pilot.png",
          text: "Приятно познакомиться!",
        },
        {
          character: "Капитан Сайда",
          imageUrl: "./images/captain.png",
          text: "Сейчас мы находимся на Берлоге, нашей родной планете. Покажи класс в посадке корабля на поверхность!",
        },
        {
          character: "Бортовой компьютер",
          imageUrl: "./images/bort.png",
          text: "Берлога — планета типа суперземля (то есть её масса больше массы Земли, но меньше массы Нептуна), по своему развитию сходна с поздним каменноугольным периодом Земли. При этом состав планеты умеренно металлический, поэтому на поверхности нет сверхтяжести.",
        },
      ],
    },
    {
      level: 2,
      text: [
        {
          character: "Капитан Сайда",
          imageUrl: "./images/captain.png",
          text: "Тебе нужно доставить груз на соседнюю площадку. Привыкай - гравитация у нас не такая сильная, как на Цетосе, но больше, чем на Тетисе",
        },
        {
          character: "Пилот",
          imageUrl: "./images/pilot.png",
          text: "Что значит 'сильная гравитация'?",
        },
        {
          character: "Бортовой компьютер",
          imageUrl: "./images/bort.png",
          text: "Гравитация на Берлоге — 0.9 м/с². Это почти в два раза больше, чем на океанском Тетисе. Она постоянно тянет корабль вниз, и тебе потребуется больше тяги двигателя, чтобы компенсировать её.",
        },
        {
          character: "Пилот",
          imageUrl: "./images/pilot.png",
          text: "Понял. Придётся быть аккуратнее с топливом.",
        },
        {
          character: "Капитан Сайда",
          imageUrl: "./images/captain.png",
          text: "Именно так! Удачи!",
        },
      ],
    },
    {
      level: 3,
      text: [
        {
          character: "Пилот",
          imageUrl: "./images/pilot.png",
          text: "А что за ветра мешают управлению кораблем?",
        },
        {
          character: "Бортовой компьютер",
          imageUrl: "./images/bort.png",
          text: "Ветра образуются из-за разности давлений на разных участках планет. Старайся облетать их, чтобы не потерять управление и не потратить лишнего топлива, ведь движение в ветрах требует большей нагрузки на двигатели, а значит и большего расхода топлива.",
        },
        {
          character: "Пилот",
          imageUrl: "./images/pilot.png",
          text: "Понял, спасибо!",
        },
      ],
    },
    {
      level: 4,
      text: [
        {
          character: "Капитан Сайда",
          imageUrl: "./images/captain.png",
          text: "Следующий пункт доставки находится в опасной зоне. Гравитация всё та же, а препятствия стали более сложными.",
        },
        {
          character: "Пилот",
          imageUrl: "./images/pilot.png",
          text: "Мой корабль тяжело разгоняется на этой планете.",
        },
        {
          character: "Бортовой компьютер",
          imageUrl: "./images/bort.png",
          text: "Это из-за ускорения. Сильная гравитация увеличивает нагрузку на двигатель. Используй короткие импульсы тяги и разгоняйся постепенно.",
        },
        {
          character: "Пилот",
          imageUrl: "./images/pilot.png",
          text: "Надо не забывать следить за топливом...",
        },
        {
          character: "Капитан Сайда",
          imageUrl: "./images/captain.png",
          text: "Верно. Не сдавайся, пилот. У тебя получится!",
        },
      ],
    },
    {
  	  level: 5,
  	  text: [
    	  {
      	  character: "Капитан Сайда",
        	imageUrl: "./images/captain.png",
        	text: "Нашим исследователям на Цетосе нужны запчасти для ремонта защитного купола. Отправляйся!",
    	  },
    	  {
      	  character: "Бортовой компьютер",
      	  imageUrl: "./images/bort.png",
      	  text: "Цетос — большая, тяжёлая, холодная планета, медленно огибающая свою звезду. Но наши исследователи строят планы по берлогоформированию этого мира. Возможно, однажды тут можно будет выжить без скафандра”
    	  },
  	  ],
	  },
    {
  	  level: 6,
  	    text: [
    	  {
      	  character: "Капитан Сайда",
      	  imageUrl: "./images/captain.png",
      	  text: "Здесь гравитация слабее, чем на Берлоге. Это поможет тебе более точно маневрировать, но и ошибок допускать нельзя.",
    	  },
    	  {
      	  character: "Пилот",
      	  imageUrl: "./images/pilot.png",
      	  text: "Чувствую, что корабль стал легче управляться. Почему так?",
    	  },
    	  {
      	  character: "Бортовой компьютер",
      	  imageUrl: "./images/bort.png",
      	  text: "Гравитация на Цетосе — всего 0.5 м/с². Это означает, что сила, тянущая корабль вниз, уменьшилась, и ты можешь легче корректировать траекторию.",
    	  },
    	  {
      	  character: "Пилот",
      	  imageUrl: "./images/pilot.png",
      	  text: "Но, наверное, это же делает торможение более сложным?",
    	  },
    	  {
        	character: "Бортовой компьютер",
        	imageUrl: "./images/bort.png",
      	  text: "Именно. На планетах с низкой гравитацией корабль сохраняет скорость дольше. Планируй остановки заранее.",
    	  },
    	  {
      	  character: "Капитан Сайда",
      	  text: "Держи курс, пилот. Этот груз ждут с нетерпением.",
      	  imageUrl: "./images/captain.png",
    	  },
  	  ],
	  },
    {
  	level: 7,
  	text: [
    	{
      	character: "Капитан Сайда",
      	imageUrl: "./images/captain.png",
      	text: "Доставить груз в этот каньон — задача не из лёгких. Здесь придётся учитывать не только гравитацию, но и инерцию. Тебе нужно понять, как она работает.",
    	},
    	{
      	character: "Пилот",
      	imageUrl: "./images/pilot.png",
      	text: "Инерция... это когда корабль продолжает двигаться, даже если я выключил двигатели?",
    	},
    	{
      	character: "Бортовой компьютер",
      	imageUrl: "./images/bort.png",
      	text: "Точно. Инерция — свойство тела сохранять свою скорость, пока на него не действует внешняя сила. В нашем случае, если ты летишь вперёд, корабль будет двигаться, пока его не замедлит сила, вроде гравитации или твоих манёвров.",
    	},
    	{
      	character: "Пилот",
      	imageUrl: "./images/pilot.png",
      	text: "Понял. Чем выше скорость, тем труднее остановиться?",
    	},
    	{
      	character: "Бортовой компьютер",
      	imageUrl: "./images/bort.png",
      	text: "Да. Учитывай это, особенно в узких местах каньона. Ты можешь использовать инерцию для экономии топлива: разогнаться, выключить тягу и двигаться вперёд за счёт накопленной скорости. Начинай тормозить заранее, чтобы избежать столкновений.",
    	},
    	{
      	character: "Капитан Сайда",
      	imageUrl: "./images/captain.png",
      	text: "Пилот, это не только о доставке груза, но и о твоём мастерстве. Удачи.",
    	},
  	],
	},
    {
  	level: 8,
  	text: [
    	{
      	character: "Капитан Сайда",
      	imageUrl: "./images/captain.png",
      	text: "Следующий пункт назначения - Тетис! Тут ты сможешь передохнуть и поболтать лапами в тёплой воде",
    	},
    	{
      	character: "Бортовой компьютер",
      	imageUrl: "./images/captain.png",
      	text: "Тетис — вторая планета, которую мы начали исследовать и заселять. Океанская планета, населённая сотнями видами рыб и рептилий. А из-за небольшой гравитации медведи тут почти порхают",
    	},
  	],
	},

  ];

  const currentCutscene = cutscenes.find((scene) => scene.level === level);

  const [displayedText, setDisplayedText] = useState("");
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isTextTyping, setIsTextTyping] = useState(false);
  const typingIntervalRef = useRef(null);
  const [currentReplic, setCurrentReplic] = useState(
    currentCutscene.text[currentTextIndex],
  );

  let charIndex = 0;

  const startTypingText = () => {
    setIsTextTyping(true);
    charIndex = 0;
    const currentText = currentReplic.text;

    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }

    typingIntervalRef.current = setInterval(() => {
      setDisplayedText((prevText) => {
        const nextChar = currentText[charIndex];
        charIndex += 1;
        return prevText + nextChar;
      });

      if (charIndex === currentText.length) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
        setIsTextTyping(false);
      }
    }, 100);
  };

  useEffect(() => {
    if (currentTextIndex < currentCutscene.text.length) {
      setDisplayedText("");
      startTypingText();
    }

    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, [currentTextIndex]);

  const handleNextText = () => {
    if (isTextTyping) {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
      setDisplayedText(currentReplic.text);
      setIsTextTyping(false);
    } else if (currentTextIndex < currentCutscene.text.length - 1) {
      setCurrentReplic(currentCutscene.text[currentTextIndex + 1]);
      setCurrentTextIndex(currentTextIndex + 1);
    } else {
      onNext();
    }
  };

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
        <div
          style={{
            display: "flex",
            gap: "20px",
            width: "100%",
          }}
        >
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
              {currentReplic.character}
            </h2>
            <p
              style={{ fontSize: "18px", lineHeight: "1.5", color: "#e0e0e0" }}
            >
              {displayedText}
            </p>
          </div>

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
              src={currentReplic.imageUrl}
              alt="Медведь"
              style={{ maxWidth: "100%", borderRadius: "10px" }}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "1000px", // Задаем максимальную ширину
          marginTop: "20px", // Отступ сверху для кнопок
        }}
      >
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
