"use strict";

import { Game } from "./game"
import { GameType } from "Game";

export class GameOriginal extends Game {
    //#player;

    constructor(params) {
        params.id = GameType.Original;
        super(params);
        this.player = params.player;
        // this.setMode(GameModeTypeEnum.Original);
    }

    /* ~~~~~~~~~~~~~~~~~~~~~~~~ IMPLEMENT ABSTRACT FUNCTIONS ~~~~~~~~~~~~~~~~~~~~~~~~ */
    // start() {
    //     this.stopTimer();
    //     this.resetPlayer();
    //     this.upateTimeCounterDisplay();
    //     this.upateMineCounterDisplay();
    //     this.setSmileFace();
    //     this.toggleGameFreezer(false);
    // }

    // initGameTimer() {
    //     this.stopTimer();
    //     this.setTimerSeconds();
    // }

    // getRevealingCase(clickedTile) {
    //     return (!clickedTile.isFlagged()) ? GameplayActionType.Reveal : GameplayActionType.NoAction;
    // }

    // getMarkingCase(clickedTile) {
    //     if (clickedTile.isUntouched()) {
    //         return GameplayActionType.SetFlag;
    //     } else if (clickedTile.isFlagged()) {
    //         return (this.marksAllowed()) ? GameplayActionType.SetMark : GameplayActionType.RemoveFlag;
    //     } else if (clickedTile.isMarked()) {
    //         return GameplayActionType.RemoveMark;
    //     }
    //     return GameplayActionType.NoAction;
    // }

    // revealTileForPlayer(clickedTile) {
    //     this.checkGameStart();
    //     this.mineFieldController.revealMinefieldTile(clickedTile, this.#player.getID()).then(revealedTiles => {
    //         this.updatePlayerForDetonatingMine(this.#player, revealedTiles);
    //         this.updateGameAfterMove(revealedTiles);
    //     });
    // }

    // flagTileForPlayer(clickedTile) {
    //     this.checkGameStart();
    //     clickedTile.setFlag(this.#player.getID(), this.#player.getColor());
    //     this.updateGameAfterMove([clickedTile]);
    // }

    // removeFlagForPlayer(clickedTile) {
    //     clickedTile.removeFlag();
    //     this.updateGameAfterMove([clickedTile]);
    // }

    // setMarkForPlayer(clickedTile) {
    //     clickedTile.setMark(this.#player.getID(), this.#player.getColor());
    //     this.updateGameAfterMove([clickedTile]);
    // }

    // removeMarkForPlayer(clickedTile) {
    //     clickedTile.removeMark();
    //     this.updateGameAfterMove([clickedTile]);
    // }

    // updateGameTimer() {
    //     this.setTimerSeconds(this.getTimerSeconds() + 1);
    //     this.upateTimeCounterDisplay();
    // }

    // endGame() {
    //     this.stopTimer();
    //     this.setGameCompleted();
    // }

    // /* ~~~~~~~~~~~~~~~~~~~~~~~~ OVERRIDE FUNCTIONS ~~~~~~~~~~~~~~~~~~~~~~~~ */
    // updateGameAfterMove(mineFieldTiles) {
    //     super.updateGameAfterMove(mineFieldTiles);
    //     this.#player.updateMoves();
    //     this.checkGameOver();
    // }

    // /* ~~~~~~~~~~~~~~~~~~~~~~~~ GAME MODE FUNCTIONS  ~~~~~~~~~~~~~~~~~~~~~~~~ */
    // resetPlayer() {
    //     this.#player.initState();
    // }

    // checkGameOver() {
    //     if (this.#player.lostGame()) {
    //         this.setGameOver(GameOverType.revealedMine);
    //         this.endGameForLoss();
    //     } else if (this.mineFieldController.isCleared()) {
    //         this.setGameOver(GameOverType.mineFieldCleared);
    //         this.endGameForWin();
    //     }
    // }

    // endGameForLoss() {
    //     this.endGame();
    //     this.setFrownFace();
    //     this.mineFieldController.revealMineField();
    // }

    // endGameForWin() {
    //     this.endGame();
    //     this.setWinnerFace();
    //     this.mineFieldController.flagAllUntouchedMineTiles(this.#player, false);
    // }

}
