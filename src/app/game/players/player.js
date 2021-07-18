'use strict';

import { arrayDifference } from 'UTILS';
import { PlayerGameStatusType } from './player-game-status-type.enum';

// update(updateData) {
//   if (updateData) {
//     Object.keys(updateData).forEach(
//       (property) => (this[property] = updateData[property]),
//     );
//   }
// }

export class Player {
  #id;
  #name;

  styles = {};

  gameStatus;
  onTurn;
  missedTurns;
  moves;

  revealedPositions;
  flagedPositions;
  markedPositions;
  detonatedPositions;

  constructor(id, name) {
    this.#id = id;
    this.#name = name;
    this.initState();
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }

  initState() {
    this.gameStatus = null;
    this.onTurn = false;
    this.resetMissedTurns();
    this.moves = 0;
    this.markedPositions = [];
    this.flagedPositions = [];
    this.revealedPositions = [];
    this.detonatedPositions = [];
  }

  increaseMoves() {
    this.moves++;
  }

  resetMissedTurns() {
    this.missedTurns = 0;
  }

  increaseMissedTurns() {
    this.missedTurns++;
  }

  setStatusOnGameGoal(playerTiles, boundary) {
    if (playerTiles.length < boundary) {
      this.gameStatus = PlayerGameStatusType.Looser;
      return;
    }
    this.gameStatus = playerTiles.length > boundary ? PlayerGameStatusType.Winner : PlayerGameStatusType.Draw;
  }

  // setStatusBasedOnOpponentStatus(opponentStatus) {
  //   if (opponentStatus === PlayerGameStatusType.Draw) {
  //     this.gameStatus = PlayerGameStatusType.Draw;
  //     return;
  //   }
  //   this.gameStatus = opponentStatus === PlayerGameStatusType.Looser ? PlayerGameStatusType.Winner : PlayerGameStatusType.Looser;
  // }

  addToDetonated(tilesPositions) {
    this.gameStatus = PlayerGameStatusType.Looser;
    this.detonatedPositions = this.#addToPositions(this.detonatedPositions, tilesPositions);
    this.removeFromStrategy(tilesPositions);
  }

  addToRevealed(tilesPositions) {
    this.revealedPositions = this.#addToPositions(this.revealedPositions, tilesPositions);
    this.removeFromStrategy(tilesPositions);
  }

  addToFlags(tilesPositions) {
    this.flagedPositions = this.#addToPositions(this.flagedPositions, tilesPositions);
    this.markedPositions = this.#removeFromPositions(this.markedPositions, tilesPositions);
  }

  addToMarks(tilesPositions) {
    this.markedPositions = this.#addToPositions(this.markedPositions, tilesPositions);
    this.flagedPositions = this.#removeFromPositions(this.flagedPositions, tilesPositions);
  }

  removeFromStrategy(tilesPositions) {
    this.markedPositions = this.#removeFromPositions(this.markedPositions, tilesPositions);
    this.flagedPositions = this.#removeFromPositions(this.flagedPositions, tilesPositions);
  }

  #addToPositions(currentPositions, positionsToRemove) {
    return currentPositions.concat(positionsToRemove);
  }

  #removeFromPositions(currentPositions, positionsToRemove) {
    return arrayDifference(currentPositions, positionsToRemove);
  }

}
