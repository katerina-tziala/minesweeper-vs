'use strict';
import GameBoard from '../GameBoard';
import { PlayerGameStatusType, GameEndType } from '../@game-board-utils.module';

export default class GameBoardOriginal extends GameBoard {

  constructor() {
    super();
  }

  get defaultConfig() {
    return { flagging: true, revealing: true, turnDuration: 0 };
  }

  onTilesRevealed(params) {
    super.onTilesRevealed(params);
    const { minefieldCleared } = params;
    if (minefieldCleared) {
      this.player.gameStatus = PlayerGameStatusType.Winner;
      this.onGameEnd(GameEndType.FieldCleared, { revealed });
    }
  }

  onGameEnd(gameEndType, tiles) {
    this.endGame();
    super.onGameEnd(gameEndType, { tiles });
  }

}

customElements.define('app-game-board-original', GameBoardOriginal);