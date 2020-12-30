"use strict";
import { valueDefined } from "~/_utils/validator";

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

  initState(goalTargetNumber = 0, allowedTurns = null, maxAllowedFlags = null) {
    this.goalTargetNumber = goalTargetNumber;
    this.maxAllowedFlags = maxAllowedFlags;
    this.allowedTurns = allowedTurns;
    this.turn = false;
    this.missedTurns = 0;
    this.moves = 0;
    this.lostGame = false;
    this.sneakPeeks = 0;
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
    return !valueDefined(this.maxAllowedFlags)
  }

  get hasFlags() {
    return this.unlimitedFlags ? true : this.allowedFlags !== 0;
  }

  get allowedFlags() {
    return this.unlimitedFlags ? null : this.maxAllowedFlags - this.placedFlags;
  }

  get placedFlags() {
    return this.entered ? this.flagsPositions.length : 0;
  }

  get flagsPositions() {
    return [...this.redundantFlagsPositions, ...this.detectedMinesPositions];
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

  inStrategyPositions(positionsToCheck) {
    const alreadyToutchedPositions = this.strategyPositions.filter((position) =>
      positionsToCheck.includes(position),
    );
    return alreadyToutchedPositions.length > 0;
  }

  get strategyPositions() {
    return [
      ...this.marksPositions,
      ...this.redundantFlagsPositions,
      ...this.detectedMinesPositions,
    ];
  }

  get hasStrategy() {
    return this.strategyPositions.length > 0;
  }

  /* UPDATE PLAYER AFTER MINEFIELD ACTIONS */
  set detonatedTile(position) {
    this.detonatedMinesPositions = [position];
    this.removeFromStrategyPositions = [position];
    this.increaseMoves();
    this.lostGame = this.detonatedMine;
  }

  set revealedTiles(movePositions) {
    this.revealedPositions = this.revealedPositions.concat(movePositions);
    this.removeFromStrategyPositions = movePositions;
    this.increaseMoves();
  }

  flaggedTile(position, wronglyPlaced) {
    wronglyPlaced
      ? (this.#inRedundantFlagsPositions = position)
      : (this.#inDetectedMinesPositions = position);
    this.increaseMoves();
  }

  set markedTile(position) {
    this.#inMarksPositions = position;
    this.increaseMoves();
    this.removeFromFlaggedPositions = [position];
  }

  set resetedTile(position) {
    this.removeFromStrategyPositions = [position];
    this.increaseMoves();
  }

  set removeFromStrategyPositions(movePositions) {
    this.removeFromMarkedPositions = movePositions;
    this.removeFromFlaggedPositions = movePositions;
  }

  set removeFromMarkedPositions(movePositions) {
    this.marksPositions = this.#removeFromPositions(
      this.marksPositions,
      movePositions,
    );
  }

  set removeFromFlaggedPositions(movePositions) {
    this.redundantFlagsPositions = this.#removeFromPositions(
      this.redundantFlagsPositions,
      movePositions,
    );
    this.detectedMinesPositions = this.#removeFromPositions(
      this.detectedMinesPositions,
      movePositions,
    );
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

  #removeFromPositions(positionsArray, positionsToRemove) {
    return positionsArray.filter(
      (position) => !positionsToRemove.includes(position),
    );
  }
}
