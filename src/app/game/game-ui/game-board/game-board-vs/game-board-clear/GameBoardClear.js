'use strict';
import GameBoardVS from '../GameBoardVS';
import { BoardFaceType } from '../../../board-face/board-face-type.enum';
import { GameEndType } from '../../game-end-type.enum';

export default class GameBoardClear extends GameBoardVS {

  constructor() {
    super();
  }

  get boardConfig() {
    const config = super.boardConfig;
    config.flagging = true;
    return config;
  }

  onTilesRevealed(event) {
    console.log('onTilesRevealed GameBoardClear');
    // const { detail: { revealedTiles, minefieldCleared } } = event;
    // if (minefieldCleared) {
    //   const { id, styles } = this.player;
    //   const flaggedTiles = this.Minefield.flagUntouchedMines(id, styles);
    //   const tiles = revealedTiles.concat(flaggedTiles);
    //   this.onGameEnd(GameEndType.FieldCleared, tiles);
    // } else {
    //   this.onPlayerMove(revealedTiles);
    // }
  }
  
}

customElements.define('app-game-board-clear', GameBoardClear);