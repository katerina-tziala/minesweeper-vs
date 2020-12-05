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

  initState() {

    this.turn = false;
    this.moves = 0;
    this.missedTurns = 0;
    this.allowedFlags = null;
    // minefield statistics
    this.redundantFlagsPositions = [];
    this.detectedMinesPositions = [];
    this.revealedPositions = [];
    this.marksPositions = [];
    // params to check if player lost the game
    this.detonatedMine = false;
    this.completedGoal = false;
    this.exceededTurnsLimit = false;
  }

  get lostGame() {
    if (this.entered) {
      return (this.detonatedMine || !this.completedGoal || this.exceededTurnsLimit) ? true : false;
    }
    return false;
  }

  increaseMoves() {
    this.moves++;
  }

  toggleTurn() {
    this.turn = !this.turn;
  }

  get minesDetected() {
    return this.entered ? this.detectedMinesPositions.length : 0;
  }

  get placedFlags() {
    return this.entered ? (this.redundantFlagsPositions.length + this.detectedMinesPositions.length) : 0;
  }

  set inRevealedPositions(position) {
    this.revealedPositions.push(position);
  }

  onSetFlag(position, wronglyPlaced) {
    wronglyPlaced ? this.#inRedundantFlagsPositions = position : this.#inDetectedMinesPositions = position;
  }

  onTileReset(position) {
    this.#removeFromBasePositionsStatistics(position);
    this.marksPositions = this.#removeFromPositionsArray(this.marksPositions, position);
  }

  onSetMark(position) {
    this.#removeFromBasePositionsStatistics(position);
    this.#inMarksPositions = position;
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
    return positionsArray.filter(position => position !== positionToRemove);
  }

  #removeFromBasePositionsStatistics(position) {
    this.redundantFlagsPositions = this.#removeFromPositionsArray(this.redundantFlagsPositions, position);
    this.detectedMinesPositions = this.#removeFromPositionsArray(this.detectedMinesPositions, position);
  }

  // setAllowedFlags(allowedFlags) {
  //     this.allowedFlags = allowedFlags;
  // }

  // getAllowedFlags() {
  //     return this.allowedFlags;
  // }

  // hasFlags() {
  //     return (this.allowedFlags === "undefined") ? true : (this.allowedFlags !== 0) ? true : false;
  // }

  // isBotPlayer() {
  //     return this.isBot;
  // }

  // enteredGame() {
  //     return this.entered;
  // }

  // getMissedTurns() {
  //     return this.missedTurns;
  // }

  // isOnTurn() {
  //     return this.turn;
  // }

  // setTurnStatus(turnStatus) {
  //     this.turn = turnStatus;
  // }



  // setRevealedMine() {
  //     this.revealdMine = true;
  // }

  // resetMissedTurns() {
  //     this.missedTurns = 0;
  // }

  // updateMissedTurns() {
  //     this.missedTurns++;
  // }

  // checkPlayerTurnsLimit(turnsLimit = 3) {
  //     const reachedmissedTurnsLimit = (this.missedTurns === turnsLimit);
  //     if (reachedmissedTurnsLimit) {
  //         this.exceededTurnsLimit = true;
  //     }
  // }

  // setOpponentStatus(opponentStatus) {
  //     this.opponent = opponentStatus;
  // }

  // updateMoves() {
  //     this.moves++;
  // }

  // lostGame() {
  //     return (this.revealdMine || this.exceededTurnsLimit) ? true : false;
  // }

  // getRevealedMine() {
  //     return this.revealdMine;
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