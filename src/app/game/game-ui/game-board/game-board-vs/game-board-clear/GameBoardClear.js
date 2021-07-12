'use strict';
import GameBoardVS from '../GameBoardVS';
import { GameEndType, TileChecker } from '../../@game-board-utils.module';

export default class GameBoardClear extends GameBoardVS {
  // flagged tiles by opponent can be revealed but cannot be flagged

  constructor() {
    super();
  }

  get defaultConfig() {
    return { revealing: true };
  }

  get hiddenStrategy() {
    return !this.config.openStrategy;
  }

  get tilesToReveal() {
    const { rows, columns } = this.config;
    const numberOfBoardTiles = rows * columns;
    return numberOfBoardTiles - this.numberOfMines;
  }

  initBoardForPlayer() {
    super.initBoardForPlayer();
    if (this.hiddenStrategy) {
      console.log('hide opponets strategy');
      console.log('button to sneak peak');
    }
  }

  getPlayerStatusOnGameGoal() {
    const playerRevealedTiles = this.Minefield.getRevealedTilesOfPlayer(this.player.id);
    const cleanTilesBoundary = this.tilesToReveal / 2;
    return super.getPlayerStatusOnGameGoal(playerRevealedTiles, cleanTilesBoundary);
  }

  #tileFlaggedByPlayer(tile) {
    return TileChecker.flagged(tile) && TileChecker.modifiedByPlayer(tile, this.player.id)
  }

  onRevealTile(event) {
    if (!this.player) return;

    const { detail: { tile } } = event;

    if (!this.#tileFlaggedByPlayer(tile)) {
      const { id } = this.player;
      this.checkTimerStart();
      this.Minefield.revealTile(tile, id);
    }
  }

  onTilesRevealed(params) {
    const { minefieldCleared, tilesPositions } = params;
    super.onTilesRevealed(params);
    minefieldCleared ? this.onMinefieldCleared(tilesPositions) : this.onRoundEnd({ revealed: tilesPositions });
  }

  onMinefieldCleared(revealed) {
    this.player.gameStatus = this.getPlayerStatusOnGameGoal();
    this.onGameEnd(GameEndType.FieldCleared, { revealed });
  }

  onFlaggedTile(params) {
    super.onFlaggedTile(params);
    const { tilesPositions } = params;
    this.onPlayerMove({ revealed: tilesPositions })
  }

  revealMinesOnBoard() {
    this.Minefield.revealMines();
    console.log('double targets/flags/strategy');
  }

}

customElements.define('app-game-board-clear', GameBoardClear);