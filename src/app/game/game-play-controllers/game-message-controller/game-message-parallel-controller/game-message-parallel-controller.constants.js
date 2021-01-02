"use strict";

export const MESSAGES = {
  gameReady: {
    title: "game ready!",
    subtitle: "minesweeper compete game",
    content: "Wait for ### to join the game!"
  },
  gameOn: {
    title: "game on!",
    subtitle: "minesweeper compete game",
    content: "### play!",
    subcontent: "Clear your minefield before ### does so!"
  },
  gameOverWin: {
    clearedMinefield: {
      title: "game over!",
      subtitle: "minesweeper compete game",
      content: "### you won the game!",
      subcontent: "You cleared the minefield before ###!"
    },
    detonatedMine: {
      title: "game over!",
      subtitle: "minesweeper compete game",
      content: "### you won the game!",
      subcontent: "### detonated a mine!"
    }
  },
  gameOverLoss: {
    detonatedMine: {
      title: "game over!",
      subtitle: "minesweeper compete game",
      content: "### you lost the game!",
      subcontent: "You detonated a mine!"
    },
    clearedMinefield: {
      title: "game over!",
      subtitle: "minesweeper compete game",
      content: "### you lost the game!",
      subcontent: "### cleared the minefield before you!"
    }
  }
};
