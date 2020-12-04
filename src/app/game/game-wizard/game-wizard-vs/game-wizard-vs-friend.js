"use strict";
import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler } from "HTML_DOM_Manager";

import { GameType } from "GameEnums";
import { Player } from "Game";

import { GameWizardVS } from "./_game-wizard-vs";
import { FORM_PARAMS } from "./_game-wizard-vs.constants";

import { FormUsername } from "~/components/form/form-username/form-username";

export class GameWizardVSFriend extends GameWizardVS {
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
    fragment.append(this.#addOpponentForm.renderForm(FORM_PARAMS));
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
