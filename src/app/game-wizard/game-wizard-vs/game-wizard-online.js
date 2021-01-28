"use strict";

import { GameType } from "GameEnums";
import { Player } from "GameModels";
import { GameWizardVS } from "./_game-wizard-vs";
import { TITLES } from "../_game-wizard.constants";
export class GameWizardOnline extends GameWizardVS {
  constructor(onClose, submitGame, clientToInvite) {
    super(onClose, submitGame);
    this.#setOpponent(clientToInvite);
    this.init();
  }

  get invite() {
    return true;
  }

  get gameType() {
    return GameType.Online;
  }

  get title() {
    return this.opponent ? super.title : TITLES.inviteFriend;
  }

  #setOpponent(clientToInvite) {
    if (clientToInvite) {
      this.opponent = new Player(clientToInvite.id, clientToInvite.username, false);
    }
  }

  generateNavigation() {
    const fragment = document.createDocumentFragment();
    fragment.append(this.wizardNavigation.generateView());
    return fragment;
  }

  generateActions() {
    const fragment = document.createDocumentFragment();
    fragment.append(this.wizardActions.generateView());
    return fragment;
  }

}
