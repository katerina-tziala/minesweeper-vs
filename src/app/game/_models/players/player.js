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

  get detonatedMine() {
    return this.detonatedMinesPositions.length;
  }

  initState(goalTargetNumber = 0, allowedTurns = null, allowedFlags = null) {
    this.goalTargetNumber = goalTargetNumber;
    this.allowedTurns = allowedTurns;
    this.allowedFlags = allowedFlags;

    this.turn = false;
    this.moves = 0;
    this.missedTurns = 0;

    // minefield statistics
    this.redundantFlagsPositions = [];
    this.detectedMinesPositions = [];
    this.revealedPositions = [];
    this.marksPositions = [];
    this.detonatedMinesPositions = [];
    // params to check if player lost the game
    this.completedGoal = false;
  }

  get lostGame() {
    if (this.entered) {
      return this.hasDetonatedMine ||
        !this.clearedMinefield ||
        this.exceededTurnsLimit
        ? true
        : false;
    }
    return false;
  }

  increaseMoves() {
    this.moves++;
  }

  increaseMissedTurns() {
    this.missedTurns++;
  }

  resetMissedTurns() {
    this.missedTurns = 0;
  }

  toggleTurn() {
    this.turn = !this.turn;
  }

  get turnsLeft() {
    return this.allowedTurns - this.missedTurns;
  }

  get exceededTurnsLimit() {
    return this.allowedTurns ? this.allowedTurns === this.missedTurns : false;
  }

  get unlimitedFlags() {
    return this.allowedFlags === null || this.allowedFlags === undefined
      ? true
      : false;
  }

  get hasFlags() {
    return this.unlimitedFlags ? true : this.allowedFlags !== 0;
  }

  increaseMissedTurns() {
    this.missedTurns++;
  }

  get minesDetected() {
    return this.entered ? this.detectedMinesPositions.length : 0;
  }

  get revealedTiles() {
    return this.entered ? this.revealedPositions.length : 0;
  }

  get placedFlags() {
    return this.entered
      ? this.redundantFlagsPositions.length + this.detectedMinesPositions.length
      : 0;
  }

  get clearedMinefield() {
    return this.goalTargetNumber
      ? this.goalTargetNumber === this.revealedPositions.length
      : false;
  }

  get detectedAllMines() {
    return this.goalTargetNumber
      ? this.goalTargetNumber === this.detectedMinesPositions.length
      : false;
  }

  set revealedTiles(positions) {
    this.revealedPositions = this.revealedPositions.concat(positions);
  }

  set detonatedTile(position) {
    this.detonatedMinesPositions = [position];
  }

  flaggedTile(position, wronglyPlaced) {
    wronglyPlaced
      ? (this.#inRedundantFlagsPositions = position)
      : (this.#inDetectedMinesPositions = position);
    this.#decreaseAllowedFlags();
  }

  set resetedTile(position) {
    this.#removeFromBasePositionsStatistics(position);
    this.marksPositions = this.#removeFromPositionsArray(
      this.marksPositions,
      position,
    );
    this.#increaseAllowedFlags();
  }

  set markedTile(position) {
    this.#removeFromBasePositionsStatistics(position);
    this.#inMarksPositions = position;
    this.#increaseAllowedFlags();
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

  // setAllowedFlags(allowedFlags) {
  //     this.allowedFlags = allowedFlags;
  // }

  // getAllowedFlags() {
  //     return this.allowedFlags;
  // }

  // enteredGame() {
  //     return this.entered;
  // }

  // getMissedTurns() {
  //     return this.missedTurns;
  // }

  // setTurnStatus(turnStatus) {
  //     this.turn = turnStatus;
  // }

  // checkPlayerTurnsLimit(turnsLimit = 3) {
  //     const reachedmissedTurnsLimit = (this.missedTurns === turnsLimit);
  //     if (reachedmissedTurnsLimit) {
  //         this.exceededTurnsLimit = true;
  //     }
  // }

  // getExceededTurnsLimit() {
  //     return this.exceededTurnsLimit;
  // }

  // getPlayerReportData() {
  //     // return {
  //     //     id: this.getId(),
  //     //     name: this.getName(),
  //     //     turn: this.turn,
  //     //     revealdMine: this.getRevealedMine(),
  //     //     exceededTurnsLimit: this.getExceededTurnsLimit(),
  //     //     missedTurns: this.missedTurns,
  //     //     lostGame: this.lostGame,
  //     //     blankTilesRevealed: this.blankTilesRevealed,
  //     //     wronglyPlacedFlags: this.wronglyPlacedFlags,
  //     //     minesDetected: this.minesDetected
  //     // };
  // }
}
