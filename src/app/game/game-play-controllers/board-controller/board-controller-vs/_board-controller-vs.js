"use strict";

import { BoardController} from "../board-controller";

export class BoardControllerVS extends BoardController {
  #_playerWaiting;

  constructor(gameId, params, minefieldActions, onRoundTimerEnd) {
    super(gameId, params, minefieldActions, onRoundTimerEnd)
  }

  set playerWaiting(player) {
    return this.#_playerWaiting = player;
  }

  get playerWaiting() {
    return this.#_playerWaiting;
  }

  get roundUpdates() {
    return [
      this.setSmileFace()
    ];
  }

  initBoardOnRound(playerOnTurn, playerWaiting) {
    this.playerOnTurn = playerOnTurn;
    this.playerWaiting = playerWaiting;
    this.faceColorType = playerOnTurn.colorType;

    return Promise.all(this.roundUpdates).then(() => {
      this.updateMinesCounter();
      return;
    });

  }

  setBoardOnRoundEnd() {
    this.updateMinesCounter();
    if (this.roundTimer) {
      this.pause();
    }
  }

}
