"use strict";

import { AppModel } from "~/_models/app-model";
export class Player extends AppModel {
  #_colorType;

  constructor(id, name, entered = true) {
    super();
    this.id = id;
    this.name = name;
    this.entered = false;
    this.isBot = false;
    this.entered = entered;
  }

  set colorType(colorType) {
    this.#_colorType = colorType;
  }

  get colorType() {
    return this.#_colorType;
  }

  initState(goalTargetNumber = 0, allowedTurns = null, allowedFlags = null) {
    this.goalTargetNumber = goalTargetNumber;
    this.allowedFlags = allowedFlags;
    this.allowedTurns = allowedTurns;
    this.turn = false;
    this.missedTurns = 0;

    this.moves = 0;
    this.lostGame = false;
    // minefield statistics
    this.redundantFlagsPositions = [];
    this.detectedMinesPositions = [];
    this.revealedPositions = [];
    this.marksPositions = [];
    this.detonatedMinesPositions = [];
  }

  increaseMoves() {
    this.moves++;
  }

  /* TURN PARAMETERS */
  toggleTurn() {
    this.turn = !this.turn;
  }

  get turnsLeft() {
    return this.allowedTurns - this.missedTurns;
  }

  resetMissedTurns() {
    this.missedTurns = 0;
  }

  increaseMissedTurns() {
    this.missedTurns++;
  }

  get exceededTurnsLimit() {
    const exceededLimits = this.allowedTurns
      ? this.allowedTurns === this.missedTurns
      : false;
    this.lostGame = exceededLimits;
    return exceededLimits;
  }

  /* CHECKS BASED ON MINEFIELD ACTIONS */
  get unlimitedFlags() {
    return this.allowedFlags === null || this.allowedFlags === undefined
      ? true
      : false;
  }

  get hasFlags() {
    return this.unlimitedFlags ? true : this.allowedFlags !== 0;
  }

  get placedFlags() {
    return this.entered
      ? this.redundantFlagsPositions.length + this.detectedMinesPositions.length
      : 0;
  }

  get detonatedMine() {
    return this.detonatedMinesPositions.length ? true : false;
  }

  get minesDetected() {
    return this.entered ? this.detectedMinesPositions.length : 0;
  }

  get revealedTiles() {
    return this.entered ? this.revealedPositions.length : 0;
  }

  get clearedMinefield() {
    const cleared = this.goalTargetNumber
      ? this.goalTargetNumber === this.revealedPositions.length
      : false;
    return cleared;
  }

  /* UPDATE PLAYER AFTER MINEFIELD ACTIONS */
  set detonatedTile(position) {
    this.detonatedMinesPositions = [position];
    this.increaseMoves();
    this.lostGame = this.detonatedMine;
  }

  set revealedTiles(movePositions) {
    this.revealedPositions = this.revealedPositions.concat(movePositions);
    this.increaseMoves();
    this.removeFromMarkedPositions = movePositions;
  }

  flaggedTile(position, wronglyPlaced) {
    wronglyPlaced
      ? (this.#inRedundantFlagsPositions = position)
      : (this.#inDetectedMinesPositions = position);
    this.#decreaseAllowedFlags();
    this.increaseMoves();
  }

  set markedTile(position) {
    this.#removeFromBasePositionsStatistics(position);
    this.#inMarksPositions = position;
    this.#increaseAllowedFlags();
    this.increaseMoves();
  }

  resetedTile(position, increaseFlags = false) {
    this.#removeFromBasePositionsStatistics(position);
    this.marksPositions = this.#removeFromPositionsArray(
      this.marksPositions,
      position,
    );
    if (increaseFlags) {
      this.#increaseAllowedFlags();
    }
    this.increaseMoves();
  }

  set removeFromMarkedPositions(movePositions) {
    this.marksPositions = this.marksPositions.filter(position => !movePositions.includes(position));
  }

  // PRIVATE FUNCTIONS
  set #inRedundantFlagsPositions(position) {
    this.redundantFlagsPositions.push(position);
  }

  set #inDetectedMinesPositions(position) {
    this.detectedMinesPositions.push(position);
  }

  set #inMarksPositions(position) {
    this.marksPositions.push(position);
  }

  #removeFromPositionsArray(positionsArray, positionToRemove) {
    return positionsArray.filter((position) => position !== positionToRemove);
  }

  #removeFromBasePositionsStatistics(position) {
    this.redundantFlagsPositions = this.#removeFromPositionsArray(
      this.redundantFlagsPositions,
      position,
    );
    this.detectedMinesPositions = this.#removeFromPositionsArray(
      this.detectedMinesPositions,
      position,
    );
  }

  #increaseAllowedFlags() {
    if (!this.unlimitedFlags) {
      this.allowedFlags++;
    }
  }

  #decreaseAllowedFlags() {
    if (!this.unlimitedFlags) {
      this.allowedFlags--;
    }
  }

}
