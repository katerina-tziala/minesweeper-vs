'use strict';
import GameBoard from '../GameBoard';
import { PlayerGameStatus } from '../player-game-status';
import { ElementHandler } from 'UI_ELEMENTS';
import { TileChecker } from '../../minefield/tile/@tile.module';


export default class GameBoardVS extends GameBoard {
  #turnTiles = [];

  constructor() {
    super();
  }

  setPlayer(player = null) {
    super.setPlayer(player);
    this.#setPlayerColorFace();
    //
  
    this.setBoardDisabledState(!this.player);
    this.initTurnTimer();
    this.#turnTiles = [];
  }


  initTurnTimer() {
    if (this.turnsTimer) {
      this.resetTimer();
      this.#setTimerColor(this.player);
    }
  }



  tileFlaggedByOpponent(tile) {
    return TileChecker.flagged(tile) && !TileChecker.modifiedByPlayer(tile, this.player.id);
  }

  tileMarkedByOpponent(tile) {
    return TileChecker.marked(tile) && !TileChecker.modifiedByPlayer(tile, this.player.id);
  }

  onPlayerMove(params) {
    console.log('on player move');
    console.log(params);
    console.log(this.player);
  }

  onRoundMove(params) {
    console.log('onRoundMove');
    console.log(params);
    console.log(this.player);
  }

  onGameEnd(gameEndType, tiles) {
    this.endGame();
    this.#setCounterIconOnGameEnd();
    this.#setTimerColor();
    super.onGameEnd(gameEndType, tiles);
  }

  setBoardFaceOnGameEnd() {
    super.setBoardFaceOnGameEnd();
    this.#setFaceColorOnGameEnd();
  }

  #setCounterIconOnGameEnd() {
    const { flagTypes, flagColors } = this.config;
    this.setFlagsCounterIcon(flagTypes, flagColors);
  }

  #setPlayerColorFace() {
    const color = this.player ? this.player.styles.colorType : '';
    this.setFaceColor(color);
  }

  #setFaceColorOnGameEnd() {
    const { gameStatus } = this.player;
    const color = gameStatus === PlayerGameStatus.Draw ? '' : this.player.styles.colorType;
    this.setFaceColor(color);
  }

  #setTimerColor(player) {
    const color_type = player ? player.styles.colorType : '';
    ElementHandler.setElementAttributes(this.GameTimer, { color_type });
  }
}

customElements.define('app-game-board-vs', GameBoardVS);