'use strict';
import GameBoardVS from '../GameBoardVS';
import { GameEndType, PlayerGameStatusType } from '../../@game-board-utils.module';

export default class GameBoardClear extends GameBoardVS {

  constructor() {
    super();
  }

  get defaultConfig() {
    return { revealing: true };
  }
  
  start(player, minesPositions = []) {
    super.start(player, minesPositions);
    //!this.turnsTimer ? this.checkTimerStart() : this.setGameStart();
  }

  onRevealTile(event) {
    console.log('onRevealTile');
    // if (!this.player) return;
    // const { detail: { tile } } = event;
    // const { id } = this.player;
    // if (!TileChecker.flagged(tile)) {
    //   this.checkTimerStart();
    //   this.Minefield.revealTile(tile, id);
    // }
  }

  onDetonatedMine(params) {
    console.log('onDetonatedMine');
    // const { tilesPositions } = params;
    // this.player.gameStatus = PlayerGameStatusType.Looser;
    // this.onGameEnd(GameEndType.DetonatedMine, { revealed: tilesPositions });
  }

  onTilesRevealed(params) {
    console.log('onTilesRevealed');
    // const { minefieldCleared, tilesPositions } = params;
    // if (minefieldCleared) {
    //   this.onGameEnd(GameEndType.FieldCleared, { revealedTiles: tilesPositions });
    // }
  }

  onChangeTileState(event) {
    console.log('onChangeTileState');
    // if (!this.player) return;
    // const { detail: { tile } } = event;
    // const untouchedTile = TileChecker.untouched(tile);
    // untouchedTile ? this.flagTile(tile) : this.#changeFlaggedTileState(tile);
  }

  flagTile(tile) {
    console.log('flagTile');
    // this.checkTimerStart();
    // const { id, styles } = this.player;
    // this.Minefield.flagTile(tile, id, styles);
  }

  onFlaggedTile(params) {
    console.log('onFlaggedTile');
    // const { tilesPositions } = params;
    // this.addToPlayerFlags(tilesPositions);
    // this.checkFlaggedTiles();
  }

  onRestoredTile(params) {
    console.log('onRestoredTile');
    // const { tilesPositions } = params;
    // this.removeFromPlayerFlags(tilesPositions);
    // this.checkFlaggedTiles();
  }
  
}

customElements.define('app-game-board-clear', GameBoardClear);