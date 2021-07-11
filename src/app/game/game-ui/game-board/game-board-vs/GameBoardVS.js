'use strict';
import GameBoard from '../GameBoard';
import { ElementHandler, GameEndType, PlayerGameStatusType, TileChecker } from '../@game-board-utils.module';
import GameRound from './game-round';

export default class GameBoardVS extends GameBoard {
  #RoundHandler;
  #timerListener;

  constructor() {
    super();
    this.#RoundHandler = new GameRound();
  }

  get turnsTimer() {
    return !!this.config.turnDuration;
  }

  get missedTurnsLimit() {
    return this.config.missedTurnsLimit || 0;
  }

  get consecutiveTurns() {
    return !!this.config.consecutiveTurns;
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
    super.start(player, minesPositions);
   // !this.turnsTimer ? this.checkTimerStart() : this.setGameStart();
  }

  setPlayer(player = null) {
    super.setPlayer(player);
    this.#setPlayerColorFace();
    if (this.player) {
      const { onTurn } = this.player;
      this.initTurnTimer();
      this.#RoundHandler.init();
      this.setBoardDisabledState(!onTurn);
    }
  }

  initTurnTimer() {
    if (this.turnsTimer) {
      this.resetTimer();
      this.#setTimerColor(this.player);
      this.GameTimer.start();
    }
  }

  stopTurnTimer() {
    if (this.turnsTimer) {
      this.setBoardDisabledState(true);
      this.stopTimer();
    }
  }

  tileFlaggedByOpponent(tile) {
    return TileChecker.flagged(tile) && !TileChecker.modifiedByPlayer(tile, this.player.id);
  }

  tileMarkedByOpponent(tile) {
    return TileChecker.marked(tile) && !TileChecker.modifiedByPlayer(tile, this.player.id);
  }

  onDetonatedMine(params) {
    this.resetPlayerMissedTurns();
    super.onDetonatedMine(params);
  }

  onPlayerMove(moveTiles) {
    this.#RoundHandler.update(moveTiles);
    this.resetPlayerMissedTurns();
    this.emitEvent('onMove', moveTiles);
  }

  onRoundEnd(moveTiles = {}) {
    this.stopTurnTimer();
    const roundResults = this.#RoundHandler.onRoundEnd(moveTiles);
    this.emitEvent('onRoundEnd', { moveTiles, roundResults });
  }

  onGameEnd(gameEndType, moveTiles = {}) {
    this.endGame();
    const roundResults = this.#RoundHandler.onRoundEnd(moveTiles);
    this.#setCounterIconOnGameEnd();
    this.#setTimerColor();
    super.onGameEnd(gameEndType, { moveTiles, roundResults });
  }

  resetPlayerMissedTurns() {
    if (this.turnsTimer && this.consecutiveTurns) {
      this.player.missedTurns = 0;
    }
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
    const color = gameStatus === PlayerGameStatusType.Draw ? '' : this.player.styles.colorType;
    this.setFaceColor(color);
  }

  #setTimerColor(player) {
    const color_type = player ? player.styles.colorType : '';
    ElementHandler.setElementAttributes(this.GameTimer, { color_type });
  }

  #setTimerListener() {
    if (this.GameTimer) {
      this.#timerListener = this.#onTurnEnd.bind(this);
      this.GameTimer.addEventListener('onTurnEnd', this.#timerListener);
    }
  }

  #removeTimerListener() {
    if (this.GameTimer) {
      this.GameTimer.removeEventListener('onTurnEnd', this.#timerListener);
    }
    this.#timerListener = undefined;
  }

  #onTurnEnd() {
    this.player.missedTurns += 1;
    if (this.player.missedTurns < this.missedTurnsLimit) {
      this.onRoundEnd({});
    } else {
      this.player.gameStatus = PlayerGameStatusType.Looser;
      this.onGameEnd(GameEndType.ExceededTurnsLimit, {});
    }
  }
}

customElements.define('app-game-board-vs', GameBoardVS);