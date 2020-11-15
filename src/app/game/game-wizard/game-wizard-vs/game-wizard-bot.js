"use strict";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";

import { Switcher } from "UserInputs";

import { GameType, OptionsSettings, BotPlayer, Player, GameOriginal } from "Game";

import { LevelWizard, OptionsWizard } from "../settings-wizards/settings-wizards";

import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, CONTENT, BUTTONS } from "../game-wizard.constants";

import { GameWizardVS } from "./game-wizard-vs";


export class GameWizardBot extends GameWizardVS {


    constructor(onClose, submitGame) {
        super(onClose, submitGame)
        this.opponent = this.botPlayer;
    }

    get type() {
        return GameType.Bot;
    }

    get botPlayer() {
        return new BotPlayer();
    }



}
