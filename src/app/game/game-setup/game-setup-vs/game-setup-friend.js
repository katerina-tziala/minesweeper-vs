"use strict";
import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler } from "HTML_DOM_Manager";
import { ADD_PLAYER_BTN } from "~/_constants/btn-text.constants";
import { FormUsername } from "~/components/form/form-username/form-username";

import { GameType } from "GameEnums";
import { Player } from "GameModels";
import { GameSetupVS } from "./_game-setup-vs";

export class GameSetupFriend extends GameSetupVS {
  #addOpponentForm = undefined;

  constructor(onClose, submitGame) {
    super(onClose, submitGame);
  }

  #updateWizardView() {
    this.wizardContainer.then(wizardContainer => {
      ElementHandler.clearContent(wizardContainer);
      wizardContainer.append(this.generateWizardHeader());
      wizardContainer.append(this.generateContentSection());
      wizardContainer.append(this.generateStepperSection());
    });
  }

  #generateAddPlayerForm() {
    const fragment = document.createDocumentFragment();
    this.#addOpponentForm = new FormUsername(this.#addOpponent.bind(this), TYPOGRAPHY.emptyString);
    fragment.append(this.#addOpponentForm.renderForm({submitBtn: ADD_PLAYER_BTN}));
    return fragment;
  }

  #addOpponent(formValues) {
    this.opponent = new Player("localFriend", formValues.username);
    this.#addOpponentForm = undefined;
    this.init();
    this.#updateWizardView();
  }

  // OVERIDDEN FUNCTIONS
  get parallelAllowed() {
    return false;
  }

  get gameType() {
    return !this.opponent ? "addOpponent" : GameType.Friend;
  }

  generateContent() {
    return this.opponent ? super.generateContent() : this.#generateAddPlayerForm();
  }

}
