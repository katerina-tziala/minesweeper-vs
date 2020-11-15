"use strict";

import { ElementHandler } from "HTML_DOM_Manager";
import { LocalStorageHelper } from "~/_utils/local-storage-helper";

import { GameType, GameOriginal } from "Game";

import { GameWizard } from "../game-wizard";

import { TITLE } from "./game-wizard-original.constants";

export class GameWizardOriginal extends GameWizard {

    constructor(onClose, submitGame) {
        super(onClose, submitGame)
    }

    get type() {
        return GameType.Original;
    }

    get title() {
        return TITLE;
    }

    renderWizardContent(wizardContent) {
        ElementHandler.clearContent(wizardContent);
        this.settingsWizards.forEach(wizard => wizardContent.append(wizard.renderWizard()));
    }

    getWizardActionButtons() {
        const actionButtons = [];
        actionButtons.push(this.generateResetButton());
        actionButtons.push(this.generatePlayButton());
        return actionButtons;
    }

    onReset() {
        Object.keys(this.gameSettings).forEach(settingKey => LocalStorageHelper.remove(settingKey));
        this.init();
        this.resetWizard();
        this.updateSubmissionButton();
    }

    onPlay() {
        const gameParams = this.gameParams;
        gameParams.player = this.player;
        this.submitGame(new GameOriginal(gameParams));
    }

}
