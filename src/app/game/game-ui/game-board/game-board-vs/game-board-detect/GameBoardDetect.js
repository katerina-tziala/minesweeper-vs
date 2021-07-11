'use strict';
import GameBoardVS from '../GameBoardVS';
import { BoardFaceType } from '../../../board-face/board-face-type.enum';
import { GameEndType } from '../../game-end-type.enum';
import {PlayerGameStatus} from '../../player-game-status';
import { TileChecker } from '../../../minefield/tile/@tile.module';
import * as MinefieldHelper from '../../../minefield/minefield-helper'
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
      return PlayerGameStatus.Looser;
    }
    return flagsPositions.length > flagsThreshold ? PlayerGameStatus.Winner : PlayerGameStatus.Draw;
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

  onTilesRevealed(event) {
    if (!this.player) return;
    const { detail: { revealedTiles, minefieldCleared } } = event;
    minefieldCleared ? this.onMinefieldCleared(revealedTiles) : this.onPlayerMove({ revealedTiles });
  }

  onMinefieldCleared(revealedTiles) {
    const { id, styles } = this.player;
    const flaggedTiles = this.Minefield.flagUntouchedMines(id, styles);
    const flaggedPositions = MinefieldHelper.getTilesPositions(flaggedTiles);
    this.addToPlayerFlags(flaggedPositions);
    this.player.gameStatus = this.playerStatusOnGameGoal;
    this.onGameEnd(GameEndType.FieldCleared, { revealedTiles, flaggedTiles });
  }

  onFlaggedTile(event) {
    super.onFlaggedTile(event);
    const { detail: { flaggedTile, allMinesDetected } } = event;
    const flaggedTiles = [flaggedTile];
    this.player.gameStatus = allMinesDetected ? this.playerStatusOnGameGoal : null;
    allMinesDetected
      ? this.onGameEnd(GameEndType.MinesDetected, { flaggedTiles })
      : this.onRoundMove({ flaggedTiles });
  }

  onRestoredTile(event) {
    super.onRestoredTile(event);
    const { detail: { tile } } = event;
    const restoredTiles = [tile];
    this.onPlayerMove({ restoredTiles });
  }

}

customElements.define('app-game-board-detect', GameBoardDetect);