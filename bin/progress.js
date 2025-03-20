interface Level {
  id: number;
  name: string;
  x: number;
  y: number;
  children: number[];
  image: string;
  lock: boolean;
  complete: boolean;
}

class LevelManager {
  private levels: Level[];
  private storageKey = "gameLevels";

  constructor(initialLevels: Omit<Level, "lock" | "complete">[]) {
    this.levels = initialLevels.map((level) => ({
      ...level,
      lock: true,
      complete: false,
    }));
    this.levels[0].lock = false;
    this.loadLevelsFromStorage();
  }

  // Получить все уровни
  public getAllLevels(): Level[] {
    return this.levels;
  }

  // Установить статус lock для конкретного уровня
  public setLockStatus(levelId: number, status: boolean): void {
    const level = this.levels.find((lvl) => lvl.id === levelId);
    if (level) {
      level.lock = status;
      this.saveLevelsToStorage();
    } else {
      throw new Error(`Level with id ${levelId} not found`);
    }
  }

  // Установить статус complete для конкретного уровня
  public setCompleteStatus(levelId: number, status: boolean): void {
    const level = this.levels.find((lvl) => lvl.id === levelId);
    if (level) {
      level.complete = status;
      this.saveLevelsToStorage();
    } else {
      throw new Error(`Level with id ${levelId} not found`);
    }
  }

  // Загрузить уровни из localStorage
  private loadLevelsFromStorage(): void {
    const storedLevels = localStorage.getItem(this.storageKey);
    if (storedLevels) {
      try {
        const parsedLevels: Level[] = JSON.parse(storedLevels);
        this.levels = this.levels.map((level) => {
          const storedLevel = parsedLevels.find((lvl) => lvl.id === level.id);
          return storedLevel ? { ...level, ...storedLevel } : level;
        });
      } catch (error) {
        console.error("Failed to parse levels from storage", error);
      }
    }
  }

  // Сохранить уровни в localStorage
  private saveLevelsToStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.levels));
    } catch (error) {
      console.error("Failed to save levels to storage", error);
    }
  }
}

// Пример использования
const initialLevels = [
  {
    id: 1,
    name: "Берлога",
    x: 400,
    y: 600,
    children: [2],
    image: "./images/berloga.png",
  },
  {
    id: 2,
    name: "Пещера",
    x: 500,
    y: 700,
    children: [],
    image: "./images/cave.png",
  },
];

//const levelManager = new LevelManager(initialLevels);
//console.log(levelManager.getAllLevels());
//levelManager.setLockStatus(1, false);
//levelManager.setCompleteStatus(1, true);
//console.log(levelManager.getAllLevels());

