"use strict";

import { Player } from "./player";
import { BotMode } from "../../_enums/bot-mode.enum";
export class BotPlayer extends Player {

  constructor() {
    super("minesweeperBot", "Minesweeper-Bot", true);
    this.mode = BotMode.Easy;
  }

  get isBot() {
    return true;
  }


  // initState() {
  //     this.turn = false;
  //     this.revealdMine = false;
  //     this.exceededTurnsLimit = false;
  //     this.missedTurns = 0;
  //     this.allowedFlags = undefined;
  //     this.moves = 0;
  //     this.flagsPositions = [];
  //     this.marksPositions = [];
  //     this.tilesRevealed = 0;
  //     this.wronglyPlacedFlags = 0;
  //     this.minesDetected = 0;
  // }

  // getID() {
  //     return this.id;
  // }

  // setColor(color) {
  //     this.color = color;
  // }

  // getColor() {
  //     return this.color;
  // }

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

  // toggleTurn() {
  //     this.turn = !this.turn;
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