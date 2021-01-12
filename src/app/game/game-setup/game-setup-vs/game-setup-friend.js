"use strict";
import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ADD_PLAYER_BTN } from "~/_constants/btn-text.constants";
import { FormUsername } from "~/components/form/form-username/form-username";
import { GameType } from "GameEnums";
import { Player } from "GameModels";
import { GameSetupVS } from "./_game-setup-vs";

export class GameSetupFriend extends GameSetupVS {
  #addOpponentForm = undefined;

  constructor(onClose, submitGame) {
    super(onClose, submitGame);
    console.log("GameSetupFriend");
  }

  get parallelAllowed() {
    return false;
  }

  get gameType() {
    return GameType.Friend;
  }

  #addOpponent(formValues) {
    this.opponent = new Player("localFriend", formValues.username);
    this.#addOpponentForm = undefined;
    this.updateView();
  }

  generateMainContent() {
    return this.opponent
      ? super.generateMainContent()
      : this.#generateAddPlayerForm();
  }

  #generateAddPlayerForm() {
    const fragment = document.createDocumentFragment();
    this.#addOpponentForm = new FormUsername(
      this.#addOpponent.bind(this),
      TYPOGRAPHY.emptyString,
    );
    fragment.append(
      this.#addOpponentForm.renderForm({ submitBtn: ADD_PLAYER_BTN }),
    );
    return fragment;
  }
}
