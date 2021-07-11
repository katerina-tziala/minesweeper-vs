'use strict';
import GameBoardVS from '../GameBoardVS';
import { GameEndType, PlayerGameStatusType } from '../../@game-board-utils.module';

export default class GameBoardDetect extends GameBoardVS {
  constructor() {
    super();
  }

  get defaultConfig() {
    return { flagging: true };
  }

  get playerStatusOnGameGoal() {
    const { flagsPositions } = this.player;
    const flagsThreshold = this.numberOfMines / 2;
    if (flagsPositions.length < flagsThreshold) {
      return PlayerGameStatusType.Looser;
    }
    return flagsPositions.length > flagsThreshold ? PlayerGameStatusType.Winner : PlayerGameStatusType.Draw;
  }

  onTilesRevealed(params) {
    const { minefieldCleared, tilesPositions } = params;
    minefieldCleared ? this.onMinefieldCleared(tilesPositions) : this.onPlayerMove({ revealed: tilesPositions });
  }

  onMinefieldCleared(revealed) {
    const { id, styles } = this.player;
    const flagged = this.Minefield.flagUntouchedMines(id, styles);
    this.addToPlayerFlags(flagged);
    this.player.gameStatus = this.playerStatusOnGameGoal;
    this.onGameEnd(GameEndType.FieldCleared, { revealed, flagged });
  }

  onChangeTileState(event) {
    const { detail: { tile } } = event;
    if (!this.player || this.tileFlaggedByOpponent(tile)) return;
    this.tileMarkedByOpponent(tile) ? this.flagTile(tile) : super.onChangeTileState(event);
  }

  flagTile(tile) {
    // flags limit -> max number of flags === number of mines
    const { flagsPositions } = this.player;
    if (this.unlimitedFlags || flagsPositions.length < this.numberOfMines) {
      super.flagTile(tile);
    }
  }

  onFlaggedTile(params) {
    super.onFlaggedTile(params);
    const { allMinesDetected, tilesPositions } = params;
    const flagged = tilesPositions;
    if (allMinesDetected) {
      this.player.gameStatus = this.playerStatusOnGameGoal;
      this.onGameEnd(GameEndType.MinesDetected, { flagged });
    } else {
      this.resetPlayerMissedTurns();
      this.onRoundEnd({ flagged });
    }
  }

  onRestoredTile(params) {
    super.onRestoredTile(params);
    const { tilesPositions } = params;
    this.onPlayerMove({ restored: tilesPositions });
  }

}

customElements.define('app-game-board-detect', GameBoardDetect);