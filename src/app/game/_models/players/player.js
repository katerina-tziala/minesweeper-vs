"use strict";
import { valueDefined } from "~/_utils/validator";
import { clone } from "~/_utils/utils.js";

import { AppModel } from "~/_models/app-model";
import { GameVSMode } from "GameEnums";
export class Player extends AppModel {
  #_colorType;

  constructor(id, name, entered = true) {
    super();
    this.id = id;
    this.name = name;
    this.entered = false;
    this.isBot = false;
    this.entered = entered;
    this.goal = GameVSMode.Clear;
    this.initState();
  }

  set colorType(colorType) {
    this.#_colorType = colorType;
  }

  get colorType() {
    return this.#_colorType;
  }

  get detectGoal() {
    return this.goal === GameVSMode.Detect;
  }

  initState(goalTargetNumber = 0, allowedTurns = null, maxAllowedFlags = null) {
    this.goalTargetNumber = goalTargetNumber;
    this.maxAllowedFlags = maxAllowedFlags;
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
  get unlimitedTurns() {
    return !valueDefined(this.allowedTurns);
  }

  get turnsLeft() {
    return this.allowedTurns - this.missedTurns;
  }

  get exceededTurnsLimit() {
    const exceededLimits = this.allowedTurns
      ? this.allowedTurns === this.missedTurns
      : false;
    this.lostGame = exceededLimits;
    return exceededLimits;
  }

  toggleTurn() {
    this.turn = !this.turn;
  }

  resetMissedTurns() {
    this.missedTurns = 0;
  }

  increaseMissedTurns() {
    this.missedTurns++;
  }

  /* CHECKS BASED ON MINEFIELD ACTIONS */
  get unlimitedFlags() {
    return !valueDefined(this.maxAllowedFlags);
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
      ? this.goalTargetNumber === this.revealedTiles
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

  get data() {
    return clone(this);
  }

  get reportData() {
    return {
      id: this.id,
      name: this.name,
      isBot: this.isBot,
      colorType: this.colorType,
      lostGame: this.lostGame,
      moves: this.moves,
      clearedTiles: this.revealedTiles,
      detectedMines: this.minesDetected,
      flags: this.placedFlags,
      marks: this.marksPositions.length,
      clearedMinefield: this.clearedMinefield,
      detonatedMine: this.detonatedMine,
      exceededTurnsLimit: this.exceededTurnsLimit,
    }
  }

  /* UPDATE PLAYER AFTER MINEFIELD ACTIONS */
  set detonatedTile(position) {
    this.detonatedMinesPositions = [position];
    this.removeFromStrategyPositions = [position];
    this.increaseMoves();
    this.lostGame = true;
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
