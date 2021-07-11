'use strict';
import GameBoard from '../GameBoard';
import { PlayerGameStatusType } from '../@game-board-utils.module';

export default class GameBoardOriginal extends GameBoard {

  constructor() {
    super();
  }

  get defaultConfig() {
    return { flagging: true, revealing: true, turnDuration: 0 };
  }

  onTilesRevealed(params) {
    const { minefieldCleared } = params;
    this.player.gameStatus = minefieldCleared ? PlayerGameStatusType.Winner : null;
    super.onTilesRevealed(params);
  }

  onGameEnd(gameEndType, tiles) {
    this.endGame();
    this.Minefield.revealMines();
    super.onGameEnd(gameEndType, { tiles });
  }

}

customElements.define('app-game-board-original', GameBoardOriginal);