import React, { useEffect } from "react";
import "./audio.js";

const GAME_PHASES = {
  PLAY: 0,
  WAITING: 1,
  DESTROY_WAINTING: 2,
};

const LEVELS = [
  {
    id: 1,
    name: "Первый уровень",
    background_image: "./images/background1.svg",
    ship_image: "./images/ship.svg",
  },
  {
    id: 2,
    name: "Второй уровень",
    background_image: "./images/background2.svg",
    ship_image: "./ship_image.png",
  },

  {
    id: 3,
    name: "Третий уровень",
    background_image: "./images/background3.svg",
    ship_image: "./ship_image.png",
  },

  {
    id: 4,
    name: "Четвертый уровень",
    background_image: "./images/background4.svg",
    ship_image: "./ship_image.png",
  },

  {
    id: 5,
    name: "Пятый уровень",
    background_image: "./images/background5.svg",
    ship_image: "./ship_image.png",
  },
  {
    id: 6,
    name: "Шестой уровень",
    background_image: "./images/background1.svg",
    ship_image: "./ship_image.png",
  },
  {
    id: 7,
    name: "Седьмой уровень",
    background_image: "./images/background2.svg",
    ship_image: "./ship_image.png",
  },
  {
    id: 8,
    name: "Восьмой уровень",
    background_image: "./images/background3.svg",
    ship_image: "./ship_image.png",
  },
];

class Game {
  constructor(level, onLose, onWin, image, audio, ship_image) {
    this.background_image = image;
    this.level = level;
    this.gamePhase = GAME_PHASES.PLAY;
    this.ships = 5;
    this.collisionCounts = {};
    this.fps = 0;
    this.frames = 0;
    this.score = 0;

    this.audio = audio;

    this.onLose = onLose;
    this.onWin = onWin;

    this.lastUpdateTime = Date.now();

    this.gameWasm = {};
    this.color = {};
    this.boundary = {};
    this.maps = null;

    this.ukey = 0;
    this.rkey = 0;
    this.dkey = 0;
    this.lkey = 0;

    this.graphics = {};

    this.isRunning = true;

    this.texture = Array.from(
      { length: 17 * 32 },
      () => Math.random() * 0.1 + 0.9,
    );

    //this.ship_image = ship_image;
    this.ship = {
      texture: ship_image,
      position: { x: 18, y: 16 }, // Позиция на канвасе
      scale: 0.1, // Масштаб (1 = 100% размера текстуры)
      rotation: 0, // Угол поворота в градусах
      collisionShape: {
        type: "rectangle", // Или 'rectangle' для прямоугольной формы
        //radius: 12, // Радиус (если круг)
        width: 24, // Ширина (если прямоугольник)
        height: 20, // Высота (если прямоугольник)
      },
    };

    // Загрузка текстуры корабля
    //ship.texture.src = "path/to/ship_image.png";
  }

  InitGraphics(N, M) {
    this.graphics.N = N | 0;
    this.graphics.M = M | 0;

    this.graphics.info = document.getElementById("info");
    this.graphics.shipsleft = document.getElementById("shipsleft");

    this.graphics.fuelbar = document.getElementById("fuelbar");
    this.graphics.fuel = document.getElementById("fuel");

    this.graphics.velocitybar = document.getElementById("velocitybar");
    this.graphics.velocity = document.getElementById("velocity");

    this.graphics.svg = document.getElementById("svg");
    this.graphics.timerText = document.getElementById("timertext");
    this.graphics.levelText = document.getElementById("leveltext");
    this.graphics.fluidcanvas = document.getElementById("fluidcanvas");
    this.graphics.fluidcanvas.width = N;
    this.graphics.fluidcanvas.height = M;
    this.graphics.fluidctx = this.graphics.fluidcanvas.getContext("2d", {
      alpha: true,
    });

    this.graphics.backcanvas = document.getElementById("backcanvas");
    let scale = window.devicePixelRatio || 1;
    this.graphics.backcanvas.width =
      this.graphics.backcanvas.clientWidth * scale;
    this.graphics.backcanvas.height =
      this.graphics.backcanvas.clientHeight * scale;
    this.graphics.backctx = this.graphics.backcanvas.getContext("2d", {
      alpha: true,
    });

    this.graphics.imagedata = this.graphics.fluidctx.createImageData(N, M);

    this.graphics.overlaycanvas = document.getElementById("overlaycanvas");
    this.graphics.overlayctx = this.graphics.overlaycanvas.getContext("2d", {
      alpha: true,
      willReadFrequently: true,
    });

    this.graphics.boundarycanvas = document.createElement("canvas");
    this.graphics.boundarycanvas.width = N * 4;
    this.graphics.boundarycanvas.height = M * 4;
    this.graphics.boundaryctx = this.graphics.boundarycanvas.getContext("2d", {
      alpha: true,
      willReadFrequently: true,
    });

    this.graphics.collisioncanvas = document.createElement("canvas");
    this.graphics.collisioncanvas.width = N * 4;
    this.graphics.collisioncanvas.height = M * 4;
    this.graphics.collisionctx = this.graphics.collisioncanvas.getContext(
      "2d",
      { alpha: true, willReadFrequently: true },
    );

    //this.graphics.shipcanvas = document.createElement("canvas");
    //this.graphics.shipcanvas.width = 36;
    //this.graphics.shipcanvas.height = 40;
    //this.graphics.shipctx = this.graphics.shipcanvas.getContext("2d", {
    //alpha: true,
    //});

    this.graphics.shipcanvas = document.createElement("canvas");
    //let scale = window.devicePixelRatio || 1; // Учитываем устройство
    this.graphics.shipcanvas.width = 36 * scale;
    this.graphics.shipcanvas.height = 40 * scale;

    // Устанавливаем CSS-стили для отображаемых размеров
    this.graphics.shipcanvas.style.width = "36px";
    this.graphics.shipcanvas.style.height = "40px";

    // Получаем контекст и масштабируем его
    this.graphics.shipctx = this.graphics.shipcanvas.getContext("2d", {
      alpha: true,
    });
    this.graphics.shipctx.scale(scale, scale);

    //this.DrawShip(this.graphics.shipctx, 18, 16);
    this.DrawShip(this.graphics.overlayctx, this.ship);
  }

  RoundRect(c, x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    c.beginPath();
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
    c.fill();
  }

  DrawShip(context, ship) {
    const { texture, position, scale, rotation } = ship;

    context.save();
    context.translate(position.x, position.y);
    context.rotate((rotation * Math.PI) / 180);
    context.scale(scale, scale);
    context.drawImage(
      texture,
      -texture.width / 2,
      -texture.height / 2,
      texture.width,
      texture.height,
    );
    context.restore();
  }

  UpdateSVGOverlay(c) {
    this.graphics.info.innerHTML = "" + Math.floor(this.fps * 10) / 10 + " fps";

    this.graphics.shipsleft.innerHTML = "Корабли: " + this.ships;

    let fuel = this.gameWasm._GetFuel();
    this.graphics.fuelbar.style.display = "block";
    this.graphics.fuel.setAttribute("y", 70 - (fuel / 1000) * 70 + 20);
    this.graphics.fuel.setAttribute("height", (fuel / 1000) * 70);

    let vy = this.gameWasm._ShipGetVY();
    if (vy > 10) vy = 10;
    if (vy < -10) vy = -10;

    this.graphics.velocitybar.style.display = "block";
    this.graphics.velocity.setAttribute("y1", 60 + vy * 5);
    this.graphics.velocity.setAttribute("y2", 60 + vy * 5);
  }

  CollisionDetection() {
    const { overlayctx, collisioncanvas } = this.graphics;

    // Очистить и отрисовать текущую ситуацию
    overlayctx.clearRect(0, 0, this.graphics.N * 4, this.graphics.M * 4);
    overlayctx.drawImage(collisioncanvas, 0, 0);
    this.DrawShip(overlayctx, this.ship);

    // Подсчет пикселей столкновения
    const newCollisionCounts = this.CountCollisionPixels(overlayctx);

    // Логика обработки столкновений
    if (
      Math.abs(newCollisionCounts.boundary - this.collisionCounts.boundary) > 10
    ) {
      this.audio.ThrustOff();
      this.gameWasm._Destroyed();
      return;
    }

    if (
      Math.abs(
        newCollisionCounts.landingpad - this.collisionCounts.landingpad,
      ) > 10
    ) {
      this.audio.ThrustOff();
      if (this.gameWasm._ShipGetVY() > 2) {
        this.gameWasm._Destroyed();
      } else {
        console.log("YOU WIN");
        this.onWin();
      }
    }
  }

  Draw() {
    const timeNow = Date.now();

    // Обновление FPS
    if (timeNow - this.lastUpdateTime > 2000) {
      this.fps = (this.frames / (timeNow - this.lastUpdateTime)) * 1e3;
      this.lastUpdateTime = timeNow;
      this.frames = 0;
    }

    // Отображение fluid canvas
    const { fluidctx, imagedata } = this.graphics;
    for (let i = 0; i < this.graphics.N * this.graphics.M * 4; i++) {
      imagedata.data[i] = this.color[i];
    }
    fluidctx.putImageData(imagedata, 0, 0);

    // Отображение boundary и корабля
    const { overlayctx, boundarycanvas } = this.graphics;
    overlayctx.clearRect(0, 0, this.graphics.N * 4, this.graphics.M * 4);
    overlayctx.drawImage(boundarycanvas, 0, 0);

    if (!this.gameWasm._IsExploded()) {
      this.ship.position.x = this.gameWasm._ShipGetX() * 4;
      this.ship.position.y = this.gameWasm._ShipGetY() * 4;
      this.DrawShip(overlayctx, this.ship);
    }

    // Обновление SVG-оверлея
    this.UpdateSVGOverlay(overlayctx);
  }

  CountCollisionPixels(context) {
    let boundaryCount = 0;
    let landingPadCount = 0;
    const data = context.getImageData(0, 0, 1024, 512).data;

    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] !== 0xff) continue; // Проверка альфа-канала
      landingPadCount += data[i + 1] === 0xff ? 1 : 0; // Зеленый цвет
      boundaryCount += data[i + 0] === 0xff ? 1 : 0; // Красный цвет
    }

    return { boundary: boundaryCount, landingpad: landingPadCount };
  }

  Loop(onLose) {
    if (!this.isRunning) return;

    if (this.gamePhase === GAME_PHASES.PLAY) {
      this.gameWasm._SetKeys(this.ukey, this.dkey, this.rkey, this.lkey);
      this.gameWasm._IsThrustOn()
        ? this.audio.ThrustOn()
        : this.audio.ThrustOff();
    }
    this.gameWasm._Step(Date.now(), this.gamePhase === GAME_PHASES.PLAY);

    this.frames++;
    window.requestAnimationFrame(() => this.Draw());

    if (this.gamePhase === GAME_PHASES.WAITING) {
      window.setTimeout(() => this.Loop(onLose), 0);
      return;
    }

    if (!this.gameWasm._IsExploded()) {
      this.CollisionDetection();
    }

    if (this.gameWasm._IsExploded() && this.gamePhase === GAME_PHASES.PLAY) {
      this.gamePhase = GAME_PHASES.DESTROY_WAITING;
      window.localStorage.dateOfLastAccident = Date.now();
      this.audio.Explosion();
      this.audio.ThrustOff();

      if (this.ships > 0) {
        // Проверяем, что у нас есть корабли
        this.ships--; // Уменьшаем только если еще есть корабли
        if (this.ships === 0) {
          window.setTimeout(() => {
            this.gamePhase = GAME_PHASES.PLAY;
            this.onLose(); // Вызываем onLose, если корабли закончились
          }, 5000);
        } else {
          window.setTimeout(() => {
            this.gamePhase = GAME_PHASES.PLAY;
            this.SetLevel(); // Устанавливаем уровень
          }, 5000);
        }
      }
    }

    window.setTimeout(() => this.Loop(onLose), 0);
  }

  SetLevel() {
    this.ResetLevel(this.level);

    let c = this.graphics.boundaryctx;
    this.DrawLevel(c, this.level);

    this.SetBoundary(c);

    this.gamePhase = GAME_PHASES.WAITING;

    this.audio.Beep();
    this.graphics.levelText.innerHTML = "Уровень " + this.level + " / " + 8;
    this.graphics.timerText.innerHTML = "3";
    window.setTimeout(() => {
      this.audio.Beep();
      this.graphics.timerText.innerHTML = "2";
      window.setTimeout(() => {
        this.audio.Beep();
        this.graphics.timerText.innerHTML = "1";
        window.setTimeout(() => {
          this.graphics.timerText.innerHTML = "";
          this.graphics.levelText.innerHTML = "";
          this.gamePhase = GAME_PHASES.PLAY;
        }, 1000);
      }, 1000);
    }, 1000);
  }

  SetBoundary(c) {
    let data = c.getImageData(0, 0, 1024, 512).data;

    let collisionctx = this.graphics.collisionctx;
    let collisionimage = collisionctx.createImageData(1024, 512);
    let offset = 0;

    for (let j = 0; j < this.graphics.M + 2; j++)
      for (let i = 0; i < this.graphics.N + 2; i++) {
        let isBoundary = data[(j * 4096 + i * 4) * 4 + 3] >= 254; // alpha
        this.boundary[offset++] = isBoundary ? 1 : 0;
      }

    for (let i = 0; i < collisionimage.data.length; i += 4) {
      if (data[i + 3] !== 0xff) continue; // alpha
      collisionimage.data[i + 3] = 0xff; // set alpha in case you want to show the image

      if (
        data[i + 0] === 0xff &&
        data[i + 1] === 0xff &&
        data[i + 2] === 0xff
      ) {
        // white is landing pad
        collisionimage.data[i + 1] = 0xff;
      } else {
        collisionimage.data[i + 0] = 0xff; // red
      }
    }
    collisionctx.putImageData(collisionimage, 0, 0);
    this.collisionCounts = this.CountCollisionPixels(collisionctx);
    console.log(this.collisionCounts);
    this.gameWasm._FixCells();
  }

  Resize() {
    let scale = { x: 1, y: 1 };
    scale.x = window.innerWidth / this.graphics.fluidcanvas.width;
    scale.y = window.innerHeight / this.graphics.fluidcanvas.height;

    if (scale.x > scale.y) {
      this.graphics.backcanvas.setAttribute(
        "style",
        "width: auto; height: " + window.innerHeight + "px;",
      );
      this.graphics.fluidcanvas.setAttribute(
        "style",
        "width: auto; height: " + window.innerHeight + "px;",
      );
      this.graphics.overlaycanvas.setAttribute(
        "style",
        "width: auto; height: " + window.innerHeight + "px;",
      );
      this.graphics.svg.setAttribute(
        "style",
        "width: auto; height: " + window.innerHeight + "px;",
      );
    } else {
      this.graphics.backcanvas.setAttribute(
        "style",
        "width: " + window.innerWidth + "px; height: auto;",
      );
      this.graphics.fluidcanvas.setAttribute(
        "style",
        "width: " + window.innerWidth + "px; height: auto;",
      );
      this.graphics.overlaycanvas.setAttribute(
        "style",
        "width: " + window.innerWidth + "px; height: auto;",
      );
      this.graphics.svg.setAttribute(
        "style",
        "width: " + window.innerWidth + "px; height: auto;",
      );
    }
  }

  onkey(event, v) {
    console.log("'", event.code, "'", event.key, "'"); // Логирование нажатой клавиши
    if (v && event.code === "Space") {
      this.audio.EnableDisable(); // Включение/выключение аудио
      return;
    }

    // Проверка уровня, возможно, эта часть нужна, если level объявлен
    // if (v && this.level <= 0) {
    //     level++;
    //     SetLevel();
    // }

    // Обработка нажатий клавиш
    if (event.code === "KeyW" || event.code === "ArrowUp") {
      this.ukey = v; // Установка ключа вверх
      console.log("W key pressed", this.ukey); // Логирование состояния
      this.gameWasm._SetKeys(this.ukey, this.dkey, this.rkey, this.lkey); // Передача ключей в WASM
    }
    if (event.code === "KeyS" || event.code === "ArrowDown") {
      this.dkey = v; // Установка ключа вниз
      this.gameWasm._SetKeys(this.ukey, this.dkey, this.rkey, this.lkey);
    }
    if (event.code === "KeyA" || event.code === "ArrowLeft") {
      this.lkey = v; // Установка ключа влево
      this.gameWasm._SetKeys(this.ukey, this.dkey, this.rkey, this.lkey);
    }
    if (event.code === "KeyD" || event.code === "ArrowRight") {
      this.rkey = v; // Установка ключа вправо
      this.gameWasm._SetKeys(this.ukey, this.dkey, this.rkey, this.lkey);
    }
  }

  async Main(onLose) {
    // Убедимся, что графика инициализирована
    this.InitGraphics(256, 128);
    this.Resize();
    window.addEventListener("resize", () => this.Resize());
    this.graphics.backctx.drawImage(
      this.background_image,
      0,
      0,
      this.graphics.backctx.canvas.width,
      this.graphics.backctx.canvas.height,
    );

    // Инициализация объекта памяти для WebAssembly
    let importOb = {
      env: {
        memory: new WebAssembly.Memory({ initial: 256, maximum: 256 }),
      },
    };

    try {
      const response = await fetch("game.wasm");
      const bytes = await response.arrayBuffer();
      const wasmInstance = await WebAssembly.instantiate(bytes, importOb);

      // Завершаем настройку после загрузки
      this.gameWasm = wasmInstance.instance.exports;
      this.gameWasm._Init();

      // Убедитесь, что память WebAssembly правильно привязана
      this.color = new Uint8Array(
        importOb.env.memory.buffer,
        this.gameWasm._GetColorOffset(),
      );
      this.boundary = new Uint32Array(
        importOb.env.memory.buffer,
        this.gameWasm._GetBoundaryOffset(),
      );
      this.maps = new Uint8Array(
        importOb.env.memory.buffer,
        this.gameWasm._GetMapsOffset(),
      );

      // Инициализация звука и обработка событий клавиш
      this.audio.Wind();
      document.addEventListener(
        "keydown",
        function (event) {
          this.onkey(event, 1);
        }.bind(this),
      );

      document.addEventListener(
        "keyup",
        function (event) {
          this.onkey(event, 0);
        }.bind(this),
      );

      // Установите уровень и начните игровой цикл
      this.SetLevel();
      this.Loop(onLose);
    } catch (err) {
      alert(`Ошибка при загрузке WebAssembly: ${err}`);
    }
  }

  GetDensityMap(x, y, offset) {
    offset = offset | 0;
    let n = 0;

    let i = Math.floor(x / 33) | 0;
    let j = Math.floor(y / 32) | 0;

    for (let jj = j - 3; jj <= j + 3; jj++)
      for (let ii = i - 3; ii <= i + 3; ii++) {
        if (jj < 0) continue;
        if (ii < 0) continue;
        if (jj >= 17) continue;
        if (ii >= 32) continue;
        if (
          ((this.maps[(ii >> 3) + jj * 4 + offset] >> (7 - (ii & 7))) & 1) ===
          0
        )
          continue;

        let r = (x - ii * 33) * (x - ii * 33) + (y - jj * 32) * (y - jj * 32);
        n += Math.exp(-0.001 * r) * this.texture[jj * 32 + ii];
      }
    return n;
  }

  DrawMap(c, level) {
    const colors = [
      { r: 63, g: 59, b: 83 }, // #3F3B53
      { r: 103, g: 61, b: 81 }, // #673D51
      { r: 70, g: 75, b: 102 }, // #464B66
      { r: 112, g: 91, b: 106 }, // #705B6A
    ];

    let offset = 68 * level;

    for (let j = 0; j < 512; j++) {
      for (let i = 0; i < 1024; i++) {
        let n = this.GetDensityMap(i, j, offset);
        let gradx = this.GetDensityMap(i + 1, j, offset) - n;
        let grady = this.GetDensityMap(i, j + 1, offset) - n;
        let rad = Math.sqrt(gradx * gradx + grady * grady);
        if (rad < 0.0001) {
          rad = 0;
        } else {
          rad = (gradx * 0.2) / rad;
        }

        // Выбираем цвет в зависимости от плотности (n)
        let col;
        if (n > 2) {
          col = 0; // #3F3B53
        } else if (n > 2) {
          col = 1; // #673D51
        } else if (n > 1.3) {
          col = 1; // #464B66
        } else {
          col = 3; // #705B6A
        }

        const color = colors[col];
        c.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;

        if (n > 1.5) {
          c.fillRect(i, j, 1, 1);
        } else if (n > 1.3 && (i & 7) === 0 && (j & 7) === 0) {
          c.translate(i, j);
          // Добавляем случайную ориентацию
          c.rotate((i * j * n) % (Math.PI * 2)); // случайное вращение
          c.fillRect(-8, -8, 1, 1);
          c.resetTransform();
        }
      }
    }
  }

  //DrawMap(c, level, color) {
  //  let offset = 68 * level;
  //  for (let j = 0; j < 512; j++)
  //    for (let i = 0; i < 1024; i++) {
  //      let n = this.GetDensityMap(i, j, offset);
  //      let gradx = this.GetDensityMap(i + 1, j, offset) - n;
  //      let grady = this.GetDensityMap(i, j + 1, offset) - n;
  //      let rad = Math.sqrt(gradx * gradx + grady * grady);
  //      if (rad < 0.0001) {
  //        rad = 0;
  //      } else {
  //        rad = (gradx * 0.2) / rad;
  //      }
  //      let col = 0.8 + rad;
  //      if (col > 1.0) col = 1.0;
  //      if (col < 0.0) col = 0.0;
  //
  //      c.fillStyle =
  //        "rgb(" +
  //        ((color.r * col) | 0) +
  //        "," +
  //        ((color.g * col) | 0) +
  //        "," +
  //        ((color.b * col) | 0) +
  //        ")";
  //
  //      if (n > 1.5) {
  //        c.fillRect(i, j, 1, 1);
  //      } else if (n > 1.3 && (i & 7) === 0 && (j & 7) === 0) {
  //        c.translate(i, j);
  //        //c.rotate(Math.random() * 2 * 3.141592);
  //        c.rotate(i * j * n); // random value
  //        c.fillRect(-8, -8, 1, 1);
  //        c.resetTransform();
  //      }
  //    }
  //}

  FillCenterText(c, str, y) {
    let x = 512 - 0.5 * c.measureText(str).width;
    c.fillStyle = "#00000040";
    c.fillText(str, x + 1, y + 1);
    c.fillText(str, x + 2, y + 2);
    c.fillText(str, x + 3, y + 3);
    c.fillStyle = "#A0A0FFA0";
    c.fillText(str, x, y);
  }

  CenterText(c, str, y) {
    let x = 512 - 0.5 * c.measureText(str).width;
    c.fillStyle = "#A0A0FF60";
    c.fillText(str, x, y);
  }

  DrawBuilding(c, x, y, w, h) {
    c.fillStyle = "#A0A0A0FF";
    c.fillRect(x, y, w, h);

    for (let j = y + 5; j < y + h - 5; j += 10)
      for (let i = x + 5; i < x + w - 5; i += 10) {
        if (Math.random() > 0.5) c.fillStyle = "#000000FF";
        else c.fillStyle = "#FFFF00FF";
        c.fillRect(i, j, 5, 5);
      }
  }

  DrawLevel(c, level) {
    // if (level === thislastlevel) return;
    // lastlevel = level;
    c.clearRect(
      0,
      0,
      this.graphics.boundarycanvas.width,
      this.graphics.boundarycanvas.height,
    );
    switch (level) {
      case 1:
        this.DrawMap(c, 0, { r: 0xb8, g: 0x69, b: 0x72 });
        c.clearRect(330, 120, 230, 30);
        c.fillStyle = "#FFFFFFFF";
        c.fillRect(330, 140, 230, 10);
        c.font = "20px Arial";
        c.fillText("Посадочная платформа", 380, 170);
        let data = c.getImageData(0, 0, 1024, 512).data;
        this.DrawBuilding(c, 880, 200, 65, 200);
        this.DrawBuilding(c, 840, 250, 25, 150);
        break;

      case 2:
        this.DrawMap(c, 1, { r: 0xb8, g: 0x69, b: 0x72 });
        c.clearRect(550, 400, 180, 70);
        c.fillStyle = "#FFFFFFFF";
        c.fillRect(550, 460, 180, 10);
        break;

      case 3: // dungeon
        this.DrawMap(c, 2, { r: 0xb8, g: 0x69, b: 0x72 });
        c.fillStyle = "#FFFFFFFF";
        c.fillRect(150, 190, 90, 10);
        this.DrawBuilding(c, 80, 150, 65, 50);
        break;

      case 4:
        for (let i = 0; i < 100; i++) {
          c.fillStyle = "#FFFFFFF0";
          c.beginPath();
          c.arc(Math.random() * 1024, Math.random() * 512, 1, 0, 2 * Math.PI);
          c.fill();
        }
        this.DrawMap(c, 3, { r: 0xb8, g: 0x69, b: 0x72 });
        c.fillStyle = "#FFFFFFFF";
        c.clearRect(320, 440, 100, 30);
        c.fillRect(320, 460, 100, 10);
        break;

      case 5: // waterfall
        this.DrawMap(c, 4, { r: 0xb8, g: 0x69, b: 0x72 });
        c.fillStyle = "#FFFFFFFF";
        c.fillRect(750, 290, 150, 10);
        this.DrawBuilding(c, 900, 250, 65, 50);
        this.DrawBuilding(c, 700, 200, 65, 100);
        break;

      case 6:
        this.DrawMap(c, 5, { r: 0xb8, g: 0x69, b: 0x72 });
        c.fillStyle = "#FFFFFFFF";
        c.clearRect(750, 80, 100, 30);
        c.fillRect(750, 110, 100, 10);
        break;

      case 7:
        this.DrawMap(c, 6, { r: 0xb8, g: 0x69, b: 0x72 });
        c.fillStyle = "#FFFFFFFF";
        for (let i = 0; i < 50; i++) {
          let h = Math.random() * 250 + 50;
          let x = Math.random() * 1024;
          if (x < 300 || x > 800) this.DrawBuilding(c, x, 500 - h, 35, h);
        }
        c.fillStyle = "#202020FF";
        c.fillRect(450, 410, 100, 90);
        c.fillStyle = "#202020FE";
        c.fillRect(430, 390, 140, 20);

        this.DrawBuilding(c, 580, 450, 65, 40);

        c.fillStyle = "#FFFFFFFF";
        c.fillRect(580, 450, 65, 10);
        break;

      case 8:
        this.gameWasm._ShipSetActive();
        this.DrawMap(c, 7, { r: 0xb8, g: 0x69, b: 0x72 });
        c.fillStyle = "#FFFFFFFF";
        c.fillRect(0, 490, 80, 10);
        break;
    }
  }

  ResetLevel(level) {
    switch (level) {
      case 1:
        this.gameWasm._Reset(
          this.level,
          0x00ffffff,
          0x00ffffff,
          0xffeb8542,
          40,
          40,
        );
        //this.gameWasm._Reset(this.level, 0xff7070, 0x602020, 0x000000, 40, 40);
        this.gameWasm._ShipSetActive();
        break;

      case 2:
        this.gameWasm._Reset(
          this.level,
          0x0090a583,
          0x0094b9af,
          0xff11299b,
          50,
          10,
        );
        this.gameWasm._ShipSetActive();
        break;

      case 3: // dungeon
        this.gameWasm._Reset(
          this.level,
          0x000078a2,
          0x000068a5,
          0xff980063,
          20,
          100,
        );
        this.gameWasm._ShipSetActive();
        break;

      case 4:
        this.gameWasm._Reset(
          this.level,
          0x00101010,
          0x00101010,
          0xff0030a0,
          25,
          60,
        );
        this.gameWasm._ShipSetActive();
        break;

      case 5: // waterfall
        this.gameWasm._Reset(
          this.level,
          0x000b17af,
          0x00000868,
          0xff0b9daf,
          25,
          50,
        );
        this.gameWasm._ShipSetActive();
        break;

      case 6:
        this.gameWasm._Reset(
          this.level,
          0x00263230,
          0x00161210,
          0xffe0e0e0,
          30,
          100,
        );
        this.gameWasm._ShipSetActive();

      case 7:
        this.gameWasm._Reset(
          this.level,
          0x00ea7d5a7d,
          0x00421c25,
          0xff4ef4f4,
          50,
          10,
        );
        this.gameWasm._ShipSetActive();
        break;

      case 8:
        this.gameWasm._Reset(
          this.level,
          0x0053942a94,
          0x009269d4,
          0xff8d4f8d,
          220,
          20,
        );
        this.gameWasm._ShipSetActive();
        break;
    }
  }

  StopGame() {
    this.audio.Stop();
    //this.audio.initialized = false;
    this.audio.ThrustOff();
    this.isRunning = false;
  }
}

const GameScreen = ({ levelNumber, onLose, onWin }) => {
  useEffect(() => {
    // Main(levelNumber, onLose);
    let level = LEVELS.find((level) => level.id === levelNumber);
    let image = new Image();
    image.src = level.background_image;
    image.onload = () => {
      let ship = new Image();
      ship.src = level.ship_image;
      ship.onload = () => {
        let audio = new AudioClass();
        audio.Init();
        let game = new Game(
          levelNumber,
          () => {
            game.StopGame();
            audio = null;
            game = null;
            onLose();
          },
          () => {
            game.StopGame();
            audio = null;
            game = null;
            onWin();
            console.log(game);
          },
          image,
          audio,
          ship,
        );
        console.log("init", game);
        game.Main(levelNumber, onLose);
        console.log("main");
      };
    };
  }, []);

  return (
    <div>
      <canvas
        id="backcanvas"
        width="1024"
        height="512"
        style={{ zIndex: 1 }}
      ></canvas>
      <canvas
        id="fluidcanvas"
        width="256"
        height="128"
        style={{ zIndex: 2 }}
      ></canvas>
      <canvas
        id="overlaycanvas"
        width="1024"
        height="512"
        style={{ zIndex: 3 }}
      ></canvas>

      <svg id="svg" viewBox="0 0 256 128" style={{ zIndex: 4 }}>
        <text id="timertext" textAnchor="middle" x="128" y="64"></text>
        <text
          id="leveltext"
          style={{ fontSize: "20px" }}
          textAnchor="middle"
          x="128"
          y="124"
        ></text>
        <text
          id="info"
          x="1"
          y="4"
          style={{ fill: "rgba(255,255,255)" }}
        ></text>
        <g id="fuelbar">
          <rect
            x="5"
            y="20"
            width="10"
            height="70"
            style={{
              fill: "rgba(255,255,255,0.5)",
              strokeWidth: 0.5,
              stroke: "rgb(0,0,0)",
              borderRadius: "10px",
            }}
          ></rect>
          <rect
            id="fuel"
            x="5"
            y="20"
            width="10"
            height="70"
            style={{ fill: "rgba(50,50,100,0.8)", strokeWidth: 0 }}
          ></rect>
          <text x="7.5" y="25" style={{ fontSize: "5px" }}>
            ⛽
          </text>
        </g>
        <text
          id="shipsleft"
          x="5"
          y="18"
          style={{ fill: "rgba(255,255,255)" }}
        ></text>

        <g id="velocitybar">
          <rect
            x="240"
            y="10"
            width="5"
            height="100"
            style={{
              fill: "rgba(255,255,255,0.2)",
              strokeWidth: 0.5,
              stroke: "rgb(0,0,0)",
            }}
          ></rect>
          <rect
            x="240"
            y="60"
            width="5"
            height="10"
            style={{ fill: "rgba(0,255,0,0.8)", strokeWidth: 0 }}
          ></rect>
          <text x="236" y="62" style={{ fontSize: "5px" }}>
            0
          </text>
          <g className="v">
            {[...Array(25)].map((_, index) => (
              <line
                key={index}
                x1="240"
                y1={15 + index * 5}
                x2="242"
                y2={15 + index * 5}
              />
            ))}
          </g>
          <line
            id="velocity"
            x1="240"
            y1="60"
            x2="245"
            y2="60"
            style={{ stroke: "rgb(255,255,255)", strokeWidth: 1 }}
          />
        </g>
      </svg>
    </div>
  );
};

export default GameScreen;
