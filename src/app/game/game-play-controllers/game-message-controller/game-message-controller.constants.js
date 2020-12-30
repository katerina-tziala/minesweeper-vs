"use strict";

export const DOM_ELEMENT_ID = {
  container: "game-message-container",
};

export const ANIMATIONS = {
  moveOutDuration: 1000,

  
};




export const DOM_ELEMENT_CLASS = {
  container: "game-message-container",
  messsageBox: "game-message-box",
  title: "title",
  subtitle: "sub-title",
  content: "content",
  messsageBoxIn: "game-message-box--slide-in",
  messsageBoxOut: "game-message-box--slide-out"
  
};

export const MESSAGES = {
  original: {
    gameOn: {
      title: "game on!",
      subtitle: "original minesweeper game",
      content: "### play!"
    },
    gameOverWin: {
      title: "game over!",
      subtitle: "original minesweeper game",
      content: "###, you won the game!",

    },
    gameOverLoss: {
      title: "game over!",
      subtitle: "original minesweeper game",
      content: "###, you lost the game!"
    }
  }
};
