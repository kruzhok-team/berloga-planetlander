import React, { useEffect } from "react";

const GAME_PHASES = {
  PLAY: 0,
  WAITING: 1,
  DESTROY_WAINTING: 2,
};

class Game {
  constructor(level, onLose, onWin, image) {
    this.background_image = image;
    this.level = level;
    this.gamePhase = GAME_PHASES.PLAY;
    this.ships = 5;
    this.collisionCounts = {};
    this.fps = 0;
    this.frames = 0;
    this.score = 0;

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

    this.texture = Array.from(
      { length: 17 * 32 },
      () => Math.random() * 0.1 + 0.9,
    );
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
    this.graphics.backcanvas.width = N;
    this.graphics.backcanvas.height = M;
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

    this.graphics.shipcanvas = document.createElement("canvas");
    this.graphics.shipcanvas.width = 36;
    this.graphics.shipcanvas.height = 40;
    this.graphics.shipctx = this.graphics.shipcanvas.getContext("2d", {
      alpha: true,
    });

    this.DrawShip(this.graphics.shipctx, 18, 16);
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

  DrawShip(c, x, y) {
    c.fillStyle = "#E8EDEEFF";
    this.RoundRect(c, x - 12, y - 12, 24, 20, 5);

    c.fillStyle = "#B0B6BBFF";
    c.fillRect(x - 6, y - 15, 12, 3);
    c.fillRect(x - 6, y + 8, 12, 3);

    c.fillStyle = "#232C4DFF";
    c.fillRect(x - 6, y + 12, 12, 6);

    c.lineWidth = 2;
    c.strokeStyle = "#B0B6BBFF";
    c.beginPath();
    c.arc(x, y - 2, 5, 0, 2 * Math.PI);
    c.stroke();

    c.lineWidth = 1.5;
    c.strokeStyle = "#232C4DFF";
    c.beginPath();

    //---
    c.moveTo(x + 5, y + 12);
    c.lineTo(x + 15, y + 17);

    c.moveTo(x - 5, y + 12);
    c.lineTo(x - 15, y + 17);

    // ---
    c.moveTo(x + 5, y + 18);
    c.lineTo(x + 15, y + 17);

    c.moveTo(x - 5, y + 18);
    c.lineTo(x - 15, y + 17);

    // ---
    c.moveTo(x + 5, y + 18);
    c.lineTo(x + 16, y + 23);

    c.moveTo(x - 5, y + 18);
    c.lineTo(x - 16, y + 23);

    // ---
    c.moveTo(x + 15, y + 17);
    c.lineTo(x + 17, y + 23);

    c.moveTo(x - 15, y + 17);
    c.lineTo(x - 17, y + 23);

    ///---
    c.moveTo(x + 17 - 3, y + 23);
    c.lineTo(x + 17 + 3, y + 23);

    c.moveTo(x - 17 - 3, y + 23);
    c.lineTo(x - 17 + 3, y + 23);

    c.stroke();
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
    let c = this.graphics.overlayctx;
    c.clearRect(0, 0, this.graphics.N * 4, this.graphics.M * 4);
    c.drawImage(this.graphics.collisioncanvas, 0, 0);
    c.drawImage(
      this.graphics.shipcanvas,
      this.gameWasm._ShipGetX() * 4 - 18,
      this.gameWasm._ShipGetY() * 4 - 20,
    );

    let newcollisioncounts = this.CountCollisionPixels(c);

    if (
      Math.abs(newcollisioncounts.boundary - this.collisionCounts.boundary) > 10
    ) {
      audio.ThrustOff();
      this.gameWasm._Destroyed();
      return;
    }

    if (
      Math.abs(
        newcollisioncounts.landingpad - this.collisionCounts.landingpad,
      ) > 10
    ) {
      audio.ThrustOff();
      if (this.gameWasm._ShipGetVY() > 2) {
        this.gameWasm._Destroyed();
      } else {
        console.log("YOU WIN");
        // ТУТ ВРОДЕ КАК ЛОГИКА ПОБЕДЫ
        this.onWin();
        this.SetLevel();
      }
    }
  }

  Draw() {
    let timeNow = Date.now();

    if (timeNow - this.lastUpdateTime > 2000) {
      this.fps = (this.frames / (timeNow - this.lastUpdateTime)) * 1e3;
      this.lastUpdateTime = timeNow;
      this.frames = 0;
    }

    // if (!this.graphics || !this.graphics.imagedata || !this.color || this.color.length !== this.graphics.N * this.graphics.M * 4) {
    //   console.error("Graphics or color data is not initialized properly.");
    //   console.log("graphics:", this.graphics);
    //   console.log("color:", this.color);
    //   console.log("N:", this.graphics ? this.graphics.N : undefined);
    //   console.log("M:", this.graphics ? this.graphics.M : undefined);
    //   console.log("color length:", this.color ? this.color.length : undefined);
    //   return;
    // }

    // copy from webassembly memory to canvas

    for (let i = 0; i < this.graphics.N * this.graphics.M * 4; i++)
      this.graphics.imagedata.data[i] = this.color[i];

    this.graphics.fluidctx.putImageData(this.graphics.imagedata, 0, 0);
    console.log("Image data:", this.graphics.imagedata);

    let c = this.graphics.overlayctx;
    c.clearRect(0, 0, this.graphics.N * 4, this.graphics.M * 4);
    c.drawImage(this.graphics.boundarycanvas, 0, 0);

    if (!this.gameWasm._IsExploded()) {
      c.drawImage(
        this.graphics.shipcanvas,
        this.gameWasm._ShipGetX() * 4 - 18,
        this.gameWasm._ShipGetY() * 4 - 20,
      );
    }
    this.UpdateSVGOverlay(c);
  }

  CountCollisionPixels(c) {
    let boundarycount = 0;
    let landingpadcount = 0;
    let data = c.getImageData(0, 0, 1024, 512).data;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] !== 0xff) continue; // alpha
      landingpadcount += data[i + 1] === 0xff ? 1 : 0; // green color
      boundarycount += data[i + 0] === 0xff ? 1 : 0; // red color
    }
    return { boundary: boundarycount, landingpad: landingpadcount };
  }

  Loop(onLose) {
    if (this.gamePhase === GAME_PHASES.PLAY) {
      this.gameWasm._SetKeys(this.ukey, this.dkey, this.rkey, this.lkey);
      this.gameWasm._IsThrustOn() ? audio.ThrustOn() : audio.ThrustOff();
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
      audio.Explosion();
      audio.ThrustOff();

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

    audio.Beep();
    this.graphics.levelText.innerHTML = "Уровень " + this.level + " / " + 8;
    this.graphics.timerText.innerHTML = "3";
    window.setTimeout(() => {
      audio.Beep();
      this.graphics.timerText.innerHTML = "2";
      window.setTimeout(() => {
        audio.Beep();
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
      audio.EnableDisable(); // Включение/выключение аудио
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
      audio.Wind();
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

  DrawMap(c, level, color) {
    let offset = 68 * level;
    for (let j = 0; j < 512; j++)
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
        let col = 0.8 + rad;
        if (col > 1.0) col = 1.0;
        if (col < 0.0) col = 0.0;

        c.fillStyle =
          "rgb(" +
          ((color.r * col) | 0) +
          "," +
          ((color.g * col) | 0) +
          "," +
          ((color.b * col) | 0) +
          ")";

        if (n > 1.5) {
          c.fillRect(i, j, 1, 1);
        } else if (n > 1.3 && (i & 7) === 0 && (j & 7) === 0) {
          c.translate(i, j);
          //c.rotate(Math.random() * 2 * 3.141592);
          c.rotate(i * j * n); // random value
          c.fillRect(-8, -8, 16, 16);
          c.resetTransform();
        }
      }
  }

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
      case -1:
        c.font = "100px Arial";
        c.fillStyle = "#000000FF";
        c.fillText("ВЫ", 200, 200);
        c.fillText("ПРОИГРАЛИ", 320, 330);
        c.strokeStyle = "#A01010FF";
        c.lineWidth = 2;
        c.strokeText("ВЫ", 200, 200);
        c.strokeText("ПРОИГРАЛИ", 320, 330);

        c.font = "50px Arial";
        c.strokeStyle = "#A01010FF";
        c.fillText("У вас закончились корабли", 230, 390);
        c.strokeText("У вас закончились корабли", 230, 390);
        break;

      case 0:
        this.ships = 5;
        this.score = 0;
        c.shadowOffsetY = 0;

        // c.font = "500px Arial";
        // CenterText(c, "📯", 350);

        c.fillStyle = "#FFFFFF";
        c.font = "100px Roboto";
        this.FillCenterText(c, "МЕЖПЛАНЕТНАЯ", 110);
        this.FillCenterText(c, "ПОЧТОВАЯ", 210);
        this.FillCenterText(c, "СЛУЖБА", 310);

        c.font = "30px Arial";
        let str = "Гарантированная доставка в течение вашей жизни";
        if (window.localStorage.dateOfLastAccident) {
          let lastAccident =
            Math.floor(
              ((Date.now() - window.localStorage.dateOfLastAccident) /
                1000 /
                3600 /
                24) *
                10000,
            ) / 10000;
          str = "Без происшествий с " + lastAccident + " дня";
        }
        this.FillCenterText(c, str, 370);

        c.font = "20px Arial";
        c.fillStyle = "#FFFFFFFF";
        this.FillCenterText(
          c,
          "Ваша задача как почтальона — доставлять почту в отдаленные колонии.",
          420,
        );
        this.FillCenterText(
          c,
          "Используйте клавиши курсора или WASD, чтобы управлять своим почтовым посадочным модулем.",
          450,
        );
        this.FillCenterText(c, "Пробел для переключения звука", 480);
        break;

      case 1:
        this.DrawMap(c, 0, { r: 0x40, g: 0xa0, b: 0x40 });
        c.clearRect(330, 120, 230, 30);
        c.fillStyle = "#FFFFFFFF";
        c.fillRect(330, 140, 230, 10);
        c.font = "20px Arial";
        c.fillText("Посадочная платформа", 380, 170);
        let data = c.getImageData(0, 0, 1024, 512).data;
        this.DrawBuilding(c, 880, 200, 65, 200);
        this.DrawBuilding(c, 840, 250, 25, 150);
        /*
            for(let i=0; i<100; i++)
            {
                let x = Math.floor(Math.random()*1024);
                let y = Math.floor(Math.random()*512);
                if (y > 200)
                if (data[(y*1024+x)*4+3] == 0xFF) DrawTree(c, x, y, 0, 0);
            }
            */
        break;

      case 2:
        this.DrawMap(c, 1, { r: 0x9d, g: 0x84, b: 0x20 });
        c.clearRect(550, 400, 180, 70);
        c.fillStyle = "#FFFFFFFF";
        c.fillRect(550, 460, 180, 10);
        break;

      case 3: // dungeon
        this.DrawMap(c, 2, { r: 0x21, g: 0x6b, b: 0x00 });
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
        this.DrawMap(c, 3, { r: 0x10, g: 0x40, b: 0x30 });
        c.fillStyle = "#FFFFFFFF";
        c.clearRect(320, 440, 100, 30);
        c.fillRect(320, 460, 100, 10);
        break;

      case 5: // waterfall
        this.DrawMap(c, 4, { r: 0x51, g: 0x75, b: 0x07 });
        c.fillStyle = "#FFFFFFFF";
        c.fillRect(750, 290, 150, 10);
        this.DrawBuilding(c, 900, 250, 65, 50);
        this.DrawBuilding(c, 700, 200, 65, 100);
        break;

      case 6:
        this.DrawMap(c, 5, { r: 0x89, g: 0x89, b: 0x89 });
        c.fillStyle = "#FFFFFFFF";
        c.clearRect(750, 80, 100, 30);
        c.fillRect(750, 110, 100, 10);
        break;

      case 7:
        this.DrawMap(c, 6, { r: 0xf4, g: 0x8d, b: 0x4e });
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
        this.DrawMap(c, 7, { r: 0x73, g: 0x9f, b: 0x2c });
        c.fillStyle = "#FFFFFFFF";
        c.fillRect(0, 490, 80, 10);
        break;

      case 9:
        this.gameWasm._Reset(level, 0xff7070, 0x8f3030, 0xa0a0a0, 128, 84);
        c.font = "80px Arial";
        c.fillStyle = "#FFFFFFFF";
        this.FillCenterText(c, "Вы успешно", 150);
        this.FillCenterText(c, "доставили всю почту", 230);
        c.font = "50px Arial";
        this.FillCenterText(
          c,
          "" + Math.floor(ships * 500 + score) + " Баллов",
          300,
        );
        break;
    }
  }

  ResetLevel(level) {
    switch (level) {
      case -1: // dead
        this.gameWasm._Reset(this.level, 0, 0, 0x1010ff, -1e3, -1e3);
        break;
      case 0: // title
        this.gameWasm._Reset(
          this.level,
          0xaf7070,
          0x804040,
          0xa0a0a0,
          -1e3,
          -1e3,
        );
        break;
      case 1:
        this.gameWasm._Reset(
          this.level,
          0x00ffffff,
          0x00ffffff,
          0xffffffff,
          40,
          40,
        );
        //this.gameWasm._Reset(this.level, 0xff7070, 0x602020, 0x000000, 40, 40);
        this.gameWasm._ShipSetActive();
        break;

      case 2:
        this.gameWasm._Reset(this.level, 0x90a583, 0x94b9af, 0x11299b, 50, 10);
        this.gameWasm._ShipSetActive();
        break;

      case 3: // dungeon
        this.gameWasm._Reset(this.level, 0x0078a2, 0x0068a5, 0x980063, 20, 100);
        this.gameWasm._ShipSetActive();
        break;

      case 4:
        this.gameWasm._Reset(this.level, 0x101010, 0x101010, 0x0030a0, 25, 60);
        this.gameWasm._ShipSetActive();
        break;

      case 5: // waterfall
        this.gameWasm._Reset(this.level, 0x0b17af, 0x000868, 0x0b9daf, 25, 50);
        this.gameWasm._ShipSetActive();
        break;

      case 6:
        this.gameWasm._Reset(this.level, 0x263230, 0x161210, 0xe0e0e0, 30, 100);
        this.gameWasm._ShipSetActive();

      case 7:
        this.gameWasm._Reset(
          this.level,
          0xea7d5a7d,
          0x421c25,
          0x4ef4f4,
          50,
          10,
        );
        this.gameWasm._ShipSetActive();
        break;

      case 8:
        this.gameWasm._Reset(
          this.level,
          0x53942a94,
          0x9269d4,
          0x8d4f8d,
          220,
          20,
        );
        this.gameWasm._ShipSetActive();
        break;

      case 9:
        this.gameWasm._Reset(this.level, 0xff7070, 0xff7070, 0xa0a0a0, 128, 64);
        break;
    }
  }
}

const GameScreen = ({ levelNumber, onLose, onWin }) => {
  useEffect(() => {
    // Main(levelNumber, onLose);
    let image = new Image();
    image.src = "./backgroud.jpg";
    image.onload = () => {
      let game = new Game(levelNumber, onLose, onWin, image);
      console.log("init", game);
      game.Main(levelNumber, onLose);
      console.log("main");
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
