"use strict";
import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ADD_PLAYER_BTN } from "~/_constants/btn-text.constants";
import { FormUsername } from "~/components/form/form-username/form-username";
import { GameType } from "GameEnums";
import { Player } from "GameModels";
import { GameWizardVS } from "./_game-wizard-vs";

export class GameWizardFriend extends GameWizardVS {
  #addOpponentForm = undefined;

  constructor(onClose, submitGame) {
    super(onClose, submitGame);
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
    const formParams = { submitBtn: ADD_PLAYER_BTN };
    this.#addOpponentForm = new FormUsername(this.#addOpponent.bind(this), TYPOGRAPHY.emptyString);
    fragment.append(this.#addOpponentForm.renderForm(formParams));
    return fragment;
  }
}
