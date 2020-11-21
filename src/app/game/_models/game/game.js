"use strict";
import { AppModel } from "~/_models/app-model";


export class Game  extends AppModel {

  constructor(params) {
    super();
    console.log(params);
    // this.id = id;
    // this.turnDuration = 30;
    // this.missedTurnsLimit = 10;
    // this.consecutiveTurns = false;


  }

}

    // #id;
    // #type;
    // #levelSettings;
    // #optionsSettings;
    // #mineDisplayType;
    // #minesToDetect;
    // #startedAt;
    // #completedAt;
    // #gameOver;
    // #timerInterval;
    // #timerSeconds;

    // constructor(params) {
    //     this.id = params.id;
    //     this.levelSettings = params.levelSettings;
    //     this.optionsSettings = params.optionsSettings;
    //     // this.#mineDisplayType = params.mineDisplayType;
    //     // this.popup = popup;
    //     // this.submitGameExit = exitGame;
    //     //this.viewController = new GameViewController();
    // }

    // setPopup(popup) {
    //     this.popup = popup;
    // }

    // setExitFunction(exitGame) {
    //     this.submitGameExit = exitGame;
    // }

    // getID() {
    //     return this.#id;
    // }

    // setMode(mode) {
    //     return this.#mode = mode;
    // }

    // getMode() {
    //     return this.#mode;
    // }

    // getMineDisplayType() {
    //     return this.#mineDisplayType;
    // }

    // getOptionsSettings() {
    //     return this.#optionsSettings;
    // }

    // marksAllowed() {
    //     return this.getOptionsSettings().getMarks();
    // }

    // getMinesToDetect() {
    //     return this.#minesToDetect;
    // }

    // setMinesToDetect(value) {
    //     return this.#minesToDetect = value;
    // }

    // getLevelSettings() {
    //     return this.#levelSettings;
    // }

    // getLevelSettingsMines() {
    //     return this.getLevelSettings().getMines();
    // }

    // getTimerSeconds() {
    //     return this.#timerSeconds;
    // }

    // getGameStarted() {
    //     return this.#startedAt;
    // }

    // setGameStarted() {
    //     this.#startedAt = Date.now();
    // }

    // getGameCompleted() {
    //     return this.#completedAt;
    // }

    // setGameCompleted() {
    //     this.#completedAt = Date.now();
    // }

    // isGameOver() {
    //     return this.#gameOver !== undefined;
    // }

    // setTimerSeconds(value = 0) {
    //     this.#timerSeconds = value;
    // }

    // setGameOver(gameOver) {
    //     this.#gameOver = gameOver;
    //     this.setGameCompleted();
    // }

    // setGameTimer() {
    //     this.upateTimeCounterDisplay();
    //     this.#timerInterval = setInterval(this.updateGameTimer.bind(this), 1000);
    // }

    // setMinesPositions() {
    //     this.getLevelSettings().setMinesPositions();
    // }

    // setUp() {
    //     this.#timerInterval = undefined;
    //     this.#startedAt = undefined;
    //     this.#completedAt = undefined;
    //     this.#gameOver = undefined;
    //     this.setTimerSeconds(0);
    //     this.setMinesToDetect(this.getLevelSettingsMines());
    //     this.mineFieldController = new MineField(AppHelper.clone(this.getLevelSettings()), this.getMineDisplayType(), this.onActiveBoardTileChange.bind(this), this.onTileAction.bind(this));
    // }

    // onActiveBoardTileChange(activeBoardTile) {
    //     if (activeBoardTile) {
    //         this.setSurpriseFace();
    //     } else if (!this.completedAt) {
    //         this.setSmileFace();
    //     }
    // }

    // init(gameWrapper) {
    //     this.setUp();
    //     return new Promise((resolve, reject) => {
    //         resolve(
    //             this.viewController.renderGameView().then(gameView => {
    //                 gameWrapper.append(gameView);
    //                 return this.setUpGameView();
    //             })).catch(err => {
    //                 reject(err);
    //             });
    //     });
    // }

    // setUpGameView() {
    //     const interfacePromises = [];
    //     interfacePromises.push(this.mineFieldController.generateMinefieldView(this.viewController.getMinefieldContainer()));
    //     interfacePromises.push(this.viewController.renderDashBoard());
    //     interfacePromises.push(this.renderGameControls());
    //     return Promise.all(interfacePromises);
    // }

    // timerStarted() {
    //     return this.#timerInterval ? true : false;
    // }

    // stopTimer() {
    //     clearInterval(this.#timerInterval);
    //     this.#timerInterval = undefined;
    // }

    // checkGameStart() {
    //     if (!this.timerStarted() && !this.getGameStarted()) {
    //         this.setTimerSeconds(1);
    //         this.setGameStarted();
    //         this.setGameTimer();
    //     }
    // }

    // updatePlayerForDetonatingMine(player, boardTiles) {
    //     if (boardTiles.length === 1 && boardTiles[0].isMineRevealed()) {
    //         player.setRevealedMine();
    //     }
    // }

    // updateGameAfterMove(tiles) {
    //     this.toggleGameFreezer(false);
    //     if (tiles.length === 1) {
    //         this.updateMinesCounter();
    //     }
    // }

    // onTileAction(clickedTile, tileAction) {
    //     let gameplayAction = GameplayActionType.NoAction;
    //     switch (tileAction) {
    //         case TileActionTypeEnum.Reveal:
    //             gameplayAction = this.getRevealingCase(clickedTile);
    //             break;
    //         case TileActionTypeEnum.Mark:
    //             gameplayAction = this.getMarkingCase(clickedTile);
    //             break;
    //     }
    //     this.handleGamePlayAction(clickedTile, gameplayAction);
    // }

    // handleGamePlayAction(clickedTile, gameplayAction) {
    //     switch (gameplayAction) {
    //         case GameplayActionType.Reveal:
    //             this.revealTileForPlayer(clickedTile);
    //             break;
    //         case GameplayActionType.SetFlag:
    //             this.flagTileForPlayer(clickedTile);
    //             break;
    //         case GameplayActionType.RemoveFlag:
    //             this.removeFlagForPlayer(clickedTile);
    //             break;
    //         case GameplayActionType.SetMark:
    //             this.setMarkForPlayer(clickedTile);
    //             break;
    //         case GameplayActionType.RemoveMark:
    //             this.removeMarkForPlayer(clickedTile);
    //             break;
    //         case GameplayActionType.NoAction:
    //             this.toggleGameFreezer(false);
    //             break;
    //     }
    // }
    // /* ~~~~~~~~~~~~~~~~~~~~~~~~ ABSTRACT FUNCTIONS ~~~~~~~~~~~~~~~~~~~~~~~~ */
    // start() { }

    // initGameTimer() { }

    // getRevealingCase(clickedTile) { }

    // getMarkingCase(clickedTile) { }

    // revealTileForPlayer(clickedTile) { }

    // flagTileForPlayer(clickedTile) { }

    // removeFlagForPlayer(clickedTile) { }

    // setMarkForPlayer(clickedTile) { }

    // removeMarkForPlayer(clickedTile) { }

    // updateGameTimer() { }

    // endGame() { }

    // /* ~~~~~~~~~~~~~~~~~~~~~~~~ INTERFACE ~~~~~~~~~~~~~~~~~~~~~~~~ */
    // toggleGameFreezer(display) {
    //     if (this.mineFieldController) {
    //         this.mineFieldController.toggleMinefieldFreezer(display);
    //     }
    // }

    // setSmileFace(playerOnTurn) {
    //     this.viewController.setSmileFace(playerOnTurn);
    // }

    // setSurpriseFace(playerOnTurn) {
    //     this.viewController.setSurpriseFace(playerOnTurn);
    // }

    // setFrownFace(playerOnTurn) {
    //     this.viewController.setFrownFace(playerOnTurn);
    // }

    // setWinnerFace(playerOnTurn) {
    //     this.viewController.setWinnerFace(playerOnTurn);
    // }

    // upateTimeCounterDisplay() {
    //     this.viewController.upateTimeCounterDisplay(this.getTimerSeconds());
    // }

    // upateMineCounterDisplay() {
    //     this.viewController.upateMineCounterDisplay(this.getMinesToDetect());
    // }

    // updateMinesCounter() {
    //     const newMinesToDetect = this.getLevelSettingsMines() - this.mineFieldController.getNumberOfPlacedFlags();
    //     if (newMinesToDetect !== this.getMinesToDetect()) {
    //         this.setMinesToDetect(newMinesToDetect)
    //         this.upateMineCounterDisplay();
    //     }
    // }

    // /* ~~~~~~~~~~~~~~~~~~~~~~~~ GAME CONTROLS ~~~~~~~~~~~~~~~~~~~~~~~~ */
    // renderGameControls() {
    //     return new Promise((resolve, reject) => {
    //         const controlsContainer = this.viewController.getControlsContainer();
    //         if (controlsContainer) {
    //             this.getControlButtons().forEach(controlBtn => controlsContainer.append(controlBtn));
    //             resolve(controlsContainer);
    //         } else {
    //             reject("controls container does not exist");
    //         }
    //     });
    // }

    // getControlButtons() {
    //     return new GameControls().getControlButtons(this.quitGame.bind(this), this.resetGameMode.bind(this), this.restartGameMode.bind(this));
    // }

    // quitGame() {
    //     this.confirmGameInterruption(GameExitTypeEnum.Quit).then(confirmed => {
    //         confirmed ? this.exitGame(GameExitTypeEnum.Quit) : this.resumeGame();
    //     });
    // }

    // resetGameMode() {
    //     this.confirmGameInterruption(GameExitTypeEnum.Reset).then(confirmed => {
    //         confirmed ? this.exitGame(GameExitTypeEnum.Reset) : this.resumeGame();
    //     });
    // }

    // restartGameMode() {
    //     this.confirmGameInterruption(GameExitTypeEnum.Restart).then(confirmed => {
    //         confirmed ? this.restartGame() : this.resumeGame();
    //     });
    // }

    // confirmGameInterruption(confirmationType) {
    //     return new Promise((resolve) => {
    //         if (this.isGameOver()) {
    //             resolve(true);
    //         } else {
    //             this.stopTimer();
    //             this.toggleGameFreezer(true);
    //             const confirmationMessage = AppHelper.clone(PopUpConstants.messages[confirmationType]);
    //             const confirmationBtn = AppHelper.clone(PopUpConstants.buttons[confirmationType]);
    //             resolve(this.popup.gameControlConfirmation(confirmationMessage, confirmationBtn));
    //         }
    //     });

    // }

    // restartGame() {
    //     this.setMinesPositions();
    //     this.viewController.clearGameView().then(() => {
    //         this.setUp();
    //         this.setUpGameView().then(() => {
    //             this.start();
    //         });
    //     });
    // }

    // resumeGame() {
    //     this.toggleGameFreezer(false);
    //     this.setTimerSeconds(this.getTimerSeconds());
    //     this.setGameTimer();
    // }

    // exitGame(type) {
    //     console.log("exit game type is", type);
    //     this.submitGameExit(type);
    // }
// }