'use strict';
import GameBoard from '../GameBoard';
import { BoardFaceType } from '../../board-face/board-face-type.enum';
import { GameEndType } from '../game-end-type.enum';

export default class GameBoardOriginal extends GameBoard {

  constructor() {
    super();
  }

  get boardConfig() {
    const config = super.boardConfig;
    config.flagging = true;
    config.revealing = true;
    config.turnDuration = 0;
    return config;
  }

  onGameEnd(gameEndType, tiles) {
    this.Minefield.revealMines();
    const faceType = gameEndType === GameEndType.DetonatedMine ? BoardFaceType.Looser : BoardFaceType.Winner;
    this.setFaceState(faceType);
    super.onGameEnd(gameEndType, tiles);
  }
}

customElements.define('app-game-board-original', GameBoardOriginal);