"use strict";

export const GAME_GOAL = {
  clear: "Clear Minefield",
  detect: "Detect All Mines"
};




export const MESSAGES = {
  gameOn: {
    title: "game on!",
    subtitle: "minesweeper vs (###) game",
    content: "### starts!"
  },
  gameOverDraw: {
    title: "game over!",
    subtitle: "minesweeper vs (###) game",
    content: "The game ended in a draw!</br>Congratulations ###, ###!"
  },
  gameOverWin: {
    detonatedMine: {
      title: "game over!",
      subtitle: "minesweeper vs (###) game",
      content: "### you won the game!",
      subcontent: "### detonated a mine!"
    },
    exceededTurnsLimit: {
      title: "game over!",
      subtitle: "minesweeper vs (###) game",
      content: "### you won the game!",
      subcontent: "### exceeded missed turns limit!"
    },
    clear: {
      title: "game over!",
      subtitle: "minesweeper vs (###) game",
      content: "### you won the game!",
      subcontent: "You cleared the most tiles!"
    },
    detect: {
      title: "game over!",
      subtitle: "minesweeper vs (###) game",
      content: "### you won the game!",
      subcontent: "You detected the most mines!"
    }
  },
  gameOverLoss: {
    detonatedMine: {
      title: "game over!",
      subtitle: "minesweeper vs (###) game",
      content: "### you lost the game!",
      subcontent: "### detonated a mine!"
    },
    exceededTurnsLimit: {
      title: "game over!",
      subtitle: "minesweeper vs (###) game",
      content: "### you lost the game!",
      subcontent: "You exceeded missed turns limit!"
    },
    clear: {
      title: "game over!",
      subtitle: "minesweeper vs (###) game",
      content: "### you lost the game!",
      subcontent: "### cleared the most tiles!"
    },
    detect: {
      title: "game over!",
      subtitle: "minesweeper vs (###) game",
      content: "### you lost the game!",
      subcontent: "### detected the most mines!"
    }
  }
};
