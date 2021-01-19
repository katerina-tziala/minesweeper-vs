"use strict";

export const GAME_GOAL = {
  clear: "Clear Minefield",
  detect: "Detect All Mines"
};

export const MESSAGES = {
  gameReady: {
    title: "game ready!",
    subtitle: "minesweeper vs (###) game",
    content: "Wait for ### to join the game!",
    duration: 4500
  },
  gameOn: {
    title: "game on!",
    subtitle: "minesweeper vs (###) game",
    content: "### starts!",
    duration: 3500
  },
  gameTurn: {
    title: "### it's your turn!",
    subtitle: "minesweeper vs (###) game",
    subcontent: "Press the button to play and show off your skills!",
    duration: 3500
  },
  gameOverDraw: {
    title: "game over!",
    subtitle: "minesweeper vs (###) game",
    content: "The game ended in a draw!</br>Congratulations ###, ###!",
    duration: 3500
  },
  gameOverWin: {
    detonatedMine: {
      title: "game over!",
      subtitle: "minesweeper vs (###) game",
      content: "### you won the game!",
      subcontent: "### detonated a mine!",
      duration: 3500
    },
    exceededTurnsLimit: {
      title: "game over!",
      subtitle: "minesweeper vs (###) game",
      content: "### you won the game!",
      subcontent: "### exceeded missed turns limit!",
      duration: 3500
    },
    clearedMinefield: {
      title: "game over!",
      subtitle: "minesweeper vs (###) game",
      content: "### you won the game!",
      subcontent: "You cleared the most tiles!"
    },
    detectedAllMines: {
      title: "game over!",
      subtitle: "minesweeper vs (###) game",
      content: "### you won the game!",
      subcontent: "You detected the most mines!",
      duration: 3500
    }
  },
  gameOverLoss: {
    detonatedMine: {
      title: "game over!",
      subtitle: "minesweeper vs (###) game",
      content: "### you lost the game!",
      subcontent: "### detonated a mine!",
      duration: 3500
    },
    exceededTurnsLimit: {
      title: "game over!",
      subtitle: "minesweeper vs (###) game",
      content: "### you lost the game!",
      subcontent: "You exceeded missed turns limit!",
      duration: 3500
    },
    clearedMinefield: {
      title: "game over!",
      subtitle: "minesweeper vs (###) game",
      content: "### you lost the game!",
      subcontent: "### cleared the most tiles!",
      duration: 3500
    },
    detectedAllMines: {
      title: "game over!",
      subtitle: "minesweeper vs (###) game",
      content: "### you lost the game!",
      subcontent: "### detected the most mines!",
      duration: 3500
    }
  }
};
