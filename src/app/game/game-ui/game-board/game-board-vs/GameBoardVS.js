'use strict';
import GameBoard from '../GameBoard';
import { PlayerGameStatus } from '../player-game-status';
import { ElementHandler } from 'UI_ELEMENTS';
import { TileChecker } from '../../minefield/tile/@tile.module';
import { GameEndType } from '../game-end-type.enum';


export default class GameBoardVS extends GameBoard {
  #turnTiles = {};
  #timerListener;

  constructor() {
    super();
  }

  get turnsTimer() {
    return !!this.config.turnDuration;
  }

  get missedTurnsLimit() {
    return this.config.missedTurnsLimit || 0;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#removeTimerListener();
  }

  init(params = {}) {
    super.init(params);
    this.#setTimerListener();
  }

  start(player, minesPositions = []) {
    if (!this.turnsTimer) {
      this.checkTimerStart();
    }
    super.start(player, minesPositions);
  }

  setPlayer(player = null) {
    super.setPlayer(player);
    this.#setPlayerColorFace();
    // if (this.player) {
    //   const { onTurn } = this.player;
    //   this.initTurnTimer();
    //   this.setBoardDisabledState(!onTurn);
    // }
  }

  initTurnTimer() {
    if (this.turnsTimer) {
      this.resetTimer();
      this.#setTimerColor(this.player);
      this.GameTimer.start();
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

  onRoundEnd(params) {
    console.log('onRoundEnd');
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

  #setTimerListener() {
    // if (this.GameTimer) {
    //   this.#timerListener = this.#onTurnEnd.bind(this);
    //   this.GameTimer.addEventListener('onTurnEnd', this.#timerListener);
    // }
  }

  #removeTimerListener() {
    // if (this.GameTimer) {
    //   this.GameTimer.removeEventListener('onTurnEnd', this.#timerListener);
    // }
    // this.#timerListener = undefined;
  }

  #onTurnEnd() {
    // this.player.missedTurns += 1;
    // if (this.player.missedTurns < this.missedTurnsLimit) {
      
    //   console.log('missed turn');
    // } else {
    //  // this.player.gameStatus = PlayerGameStatus.Looser;
    //  // this.onGameEnd(GameEndType.ExceededTurnsLimit, {});
    //   console.log('lost game based on turns');
    // }
    
    console.log('onTurnEnd');
    // console.log(this.player);
    // console.log(this.config);
    // console.log(this.missedTurnsLimit);

    //     consecutiveTurns: true
    // missedTurnsLimit: 10


  }
}

customElements.define('app-game-board-vs', GameBoardVS);