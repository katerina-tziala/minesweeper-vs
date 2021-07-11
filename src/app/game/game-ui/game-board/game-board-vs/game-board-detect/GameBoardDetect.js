'use strict';
import GameBoardVS from '../GameBoardVS';
import { BoardFaceType } from '../../../board-face/board-face-type.enum';
import { GameEndType } from '../../game-end-type.enum';

import { TileChecker } from '../../../minefield/tile/@tile.module';
export default class GameBoardDetect extends GameBoardVS {

  constructor() {
    super();
  }

  get boardConfig() {
    const config = super.boardConfig;
    config.flagging = true;
    return config;
  }

  onTilesRevealed(event) {
    if (!this.player) return;
    const { detail: { revealedTiles, minefieldCleared } } = event;
    if (minefieldCleared) {
      const { id, styles } = this.player;
      const flaggedTiles = this.Minefield.flagUntouchedMines(id, styles);
      const tiles = revealedTiles.concat(flaggedTiles);
      this.onGameEnd(GameEndType.FieldCleared, tiles);
    } else {
      this.onPlayerMove(revealedTiles);
    }
  }

  onChangeTileState(event) {
    const { detail: { tile } } = event;
    if (!this.player || this.tileFlaggedByOpponent(tile)) return;
    this.tileMarkedByOpponent(tile) ? this.flagTile(tile) : super.onChangeTileState(event);
  }

  flagTile(tile) {
    //   this.#checkStart();
    console.log('check player flags');
    console.log(this.player);
    const { id, styles } = this.player;
    this.Minefield.flagTile(tile, id, styles);
  }


}

customElements.define('app-game-board-detect', GameBoardDetect);