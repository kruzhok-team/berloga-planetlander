class LevelManager {
  constructor(initialLevels) {
    this.storageKey = "gameLevels";
    this.levels = initialLevels.map((level) => ({
      ...level,
      lock: false,
      complete: false,
    }));
    this.levels[0].lock = false;
    this.loadLevelsFromStorage();
  }

  // Получить все уровни
  getAllLevels() {
    return this.levels;
  }

  // Установить статус lock для конкретного уровня
  setLockStatus(levelId, status) {
    const level = this.levels.find((lvl) => lvl.id === levelId);
    if (level) {
      level.lock = status;
      this.saveLevelsToStorage();
    } else {
      throw new Error(`Level with id ${levelId} not found`);
    }
  }

  setCompleteStatus(levelId, status) {
    const level = this.levels.find((lvl) => lvl.id === levelId);
    if (level) {
      level.complete = status;

      // Если уровень отмечен как завершенный, снимаем блокировку с дочерних уровней
      if (status === true) {
        level.children.forEach((child) => {
          this.setLockStatus(child, false);
        });
        //this.levels.forEach((lvl) => {
        //if (lvl.parentId === levelId) {
        //lvl.lock = false;
        //}
      }

      this.saveLevelsToStorage();
    } else {
      throw new Error(`Level with id ${levelId} not found`);
    }
  }

  // Установить статус complete для конкретного уровня
  //setCompleteStatus(levelId, status) {
  //  const level = this.levels.find((lvl) => lvl.id === levelId);
  //  if (level) {
  //    level.complete = status;
  //    this.saveLevelsToStorage();
  //  } else {
  //    throw new Error(`Level with id ${levelId} not found`);
  //  }
  //}

  // Загрузить уровни из localStorage
  loadLevelsFromStorage() {
    const storedLevels = localStorage.getItem(this.storageKey);
    if (storedLevels) {
      try {
        const parsedLevels = JSON.parse(storedLevels);
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
  saveLevelsToStorage() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.levels));
    } catch (error) {
      console.error("Failed to save levels to storage", error);
    }
  }
}

// Пример использования
//const initialLevels = [
//  {
//    id: 1,
//    name: "Берлога",
//    x: 400,
//    y: 600,
//    children: [2],
//    image: "./images/berloga.png",
//  },
//  {
//    id: 2,
//    name: "Пещера",
//    x: 500,
//    y: 700,
//    children: [],
//    image: "./images/cave.png",
//  },
//];
//
//const levelManager = new LevelManager(initialLevels);
//console.log(levelManager.getAllLevels());
//levelManager.setLockStatus(1, false);
//levelManager.setCompleteStatus(1, true);
//console.log(levelManager.getAllLevels());
//
export default LevelManager;
