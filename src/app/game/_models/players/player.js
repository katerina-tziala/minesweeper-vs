"use strict";

import { AppModel } from "~/_models/app-model";

export class Player extends AppModel {
  #_colorType;

  constructor(id, name, opponent = false) {
    super();
    this.id = id;
    this.name = name;
    this.isOpponent = opponent;
    this.entered = true;
    this.initState();
  }

  get isBot() {
    return false;
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
    //
    // this.exceededTurnsLimit = false;
    // this.missedTurns = 0;
    // this.allowedFlags = undefined;


    this.detonatedMine = false;
    this.revealedPositions = [];
    this.flagsPositions = [];
    this.marksPositions = [];
    this.redundantFlagsPositions = [];
    this.detectedMinesPositions = [];
  }

  increaseMoves() {
    this.moves++;
  }

  toggleTurn() {
    this.turn = !this.turn;
  }

  get minesDetected() {
    return this.detectedMinesPositions.length;
  }

  set inRevealedPositions(position) {
    this.revealedPositions.push(position);
  }

  set #inFlagsPositions(position) {
    this.flagsPositions.push(position);
  }

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
    this.flagsPositions = this.#removeFromPositionsArray(this.flagsPositions, position);
    this.redundantFlagsPositions = this.#removeFromPositionsArray(this.redundantFlagsPositions, position);
    this.detectedMinesPositions = this.#removeFromPositionsArray(this.detectedMinesPositions, position);
  }

  onSetFlag(position, wronglyPlaced) {
    this.#inFlagsPositions = position;
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

  // isOpponent() {
  //     return this.opponent;
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


  // getUpdatedPositions(positions, newPositions, add = true) {
  //     positions = [...positions].filter(position => !newPositions.includes(position));
  //     if (add) {
  //         positions = positions.concat(newPositions);
  //     }
  //     return positions;
  // }

  // updateFlagsPositions(newPositions, add = true) {
  //     this.flagsPositions = this.getUpdatedPositions(this.flagsPositions, newPositions, add);
  // }

  // getFlagsPositions() {
  //     return this.flagsPositions;
  // }

  // updateMarksPositions(newPositions, add = true) {
  //     this.marksPositions = this.getUpdatedPositions(this.marksPositions, newPositions, add);
  // }

  // getMarksPositions() {
  //     return this.marksPositions;
  // }

  // updateBlankTilesRevealed() {
  //     // this.blankTilesRevealed++;
  // }

  // updateWronglyPlacedFlags() {
  //     // this.wronglyPlacedFlags++;
  // }

  // updateMinesDetected() {
  //     // this.minesDetected++;
  // }


}