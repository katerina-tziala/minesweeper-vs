'use strict';
import GameBoard from '../GameBoard';
import { PlayerGameStatus } from '../player-game-status';

export default class GameBoardOriginal extends GameBoard {

  constructor() {
    super();
  }

  get defaultConfig() {
    return { flagging: true, revealing: true, turnDuration: 0 };
  }

  onTilesRevealed(event) {
    const { detail: { minefieldCleared  } } = event;
    this.player.gameStatus = minefieldCleared ? PlayerGameStatus.Winner : null;
    super.onTilesRevealed(event);
  }

  onGameEnd(gameEndType, tiles) {
    this.endGame();
    this.Minefield.revealMines();
    super.onGameEnd(gameEndType, { tiles });
  }

}

customElements.define('app-game-board-original', GameBoardOriginal);