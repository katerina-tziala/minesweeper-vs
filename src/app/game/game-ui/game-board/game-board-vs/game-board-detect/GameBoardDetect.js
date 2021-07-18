'use strict';
import GameBoardVS from '../GameBoardVS';
import { GameEndType } from '../../@game-board-utils.module';

export default class GameBoardDetect extends GameBoardVS {
  constructor() {
    super();
  }

  get defaultConfig() {
    return { flagging: true };
  }

  #setPlayerStatusOnGameGoal() {
    const { flagedPositions } = this.player;
    const flagsBoundary = this.numberOfMines / 2;
    this.player.setStatusOnGameGoal(flagedPositions, flagsBoundary);
  }
  
  onTilesRevealed(params) {
    const { minefieldCleared, tilesPositions } = params;
    super.onTilesRevealed(params);
    minefieldCleared ? this.onMinefieldCleared(tilesPositions) : this.onPlayerMove({ revealed: tilesPositions });
  }

  onMinefieldCleared(revealed) {
    const { id, styles } = this.player;
    const flagged = this.Minefield.flagUntouchedMines(id, styles);
    this.player.addToFlags(flagged);
    this.#setPlayerStatusOnGameGoal();
    this.onGameEnd(GameEndType.FieldCleared, { revealed, flagged });
  }

  onFlaggedTile(params) {
    super.onFlaggedTile(params);
    const { allMinesDetected, tilesPositions } = params;
    const flagged = tilesPositions;
    if (allMinesDetected) {
      this.#setPlayerStatusOnGameGoal();
      this.onGameEnd(GameEndType.MinesDetected, { flagged });
    } else {
      this.onRoundEnd({ flagged });
    }
  }

}

customElements.define('app-game-board-detect', GameBoardDetect);