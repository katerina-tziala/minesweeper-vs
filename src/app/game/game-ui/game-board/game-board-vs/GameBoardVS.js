'use strict';
import GameBoard from '../GameBoard';

import { TileChecker } from '../../minefield/tile/@tile.module';
export default class GameBoardVS extends GameBoard {
  #turnTiles = [];

  constructor() {
    super();
  }

  get boardConfig() {
    const config = super.boardConfig;
    return config;
  }

  setPlayer(player = null) {
    super.setPlayer(player);
    this.setFaceColor();

    // this.boardConfig.flagTypes
    // this.boardConfig.colorTypes
    // on game end
    this.setBoardDisabledState(!this.player);
    this.initTurnTimer();
    this.#turnTiles = [];
  }

  tileFlaggedByOpponent(tile) {
    return TileChecker.flagged(tile) && !TileChecker.modifiedByPlayer(tile, this.player.id);
  }

  tileMarkedByOpponent(tile) {
    return TileChecker.marked(tile) && !TileChecker.modifiedByPlayer(tile, this.player.id);
  }

  onPlayerMove(tiles) {
    console.log('on player move', tiles);
  }
}

customElements.define('app-game-board-vs', GameBoardVS);