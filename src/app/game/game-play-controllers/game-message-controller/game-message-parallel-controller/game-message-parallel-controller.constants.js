"use strict";

export const MESSAGES = {
  gameReady: {
    title: "game ready!",
    subtitle: "minesweeper compete game",
    content: "Wait for ### to join the game!",
    duration: 4500
  },
  gameOn: {
    title: "game on!",
    subtitle: "minesweeper compete game",
    content: "### play!",
    subcontent: "Clear your minefield before ### does so!",
    duration: 3500
  },
  gameOverWin: {
    clearedMinefield: {
      title: "game over!",
      subtitle: "minesweeper compete game",
      content: "### you won the game!",
      subcontent: "You cleared the minefield before ###!",
      duration: 3500
    },
    detonatedMine: {
      title: "game over!",
      subtitle: "minesweeper compete game",
      content: "### you won the game!",
      subcontent: "### detonated a mine!",
      duration: 3500
    }
  },
  gameOverLoss: {
    detonatedMine: {
      title: "game over!",
      subtitle: "minesweeper compete game",
      content: "### you lost the game!",
      subcontent: "You detonated a mine!",
      duration: 3500
    },
    clearedMinefield: {
      title: "game over!",
      subtitle: "minesweeper compete game",
      content: "### you lost the game!",
      subcontent: "### cleared the minefield before you!",
      duration: 3500
    }
  }
};
