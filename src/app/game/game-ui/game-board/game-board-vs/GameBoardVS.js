'use strict';
import GameBoard from '../GameBoard';

export default class GameBoardVS extends GameBoard {

  constructor() {
    super();
  }

  get boardConfig() {
    const config = super.boardConfig;
    // vs game variation
    config.flagging = true;
    return config;
  }

  setPlayer(player = null) {
    super.setPlayer(player);
    this.setFaceColor();
  }
}

customElements.define('app-game-board-vs', GameBoardVS);