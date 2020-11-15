"use strict";
import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";

import { Switcher } from "UserInputs";
import { LocalStorageHelper } from "~/_utils/local-storage-helper";
import { GameType, OptionsSettings, LevelSettings, Player, GameOriginal } from "Game";

import { LevelWizard, OptionsWizard } from "./settings-wizards/settings-wizards";
import { preventInteraction, clone, replaceStringParameter } from "~/_utils/utils";
import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, CONTENT, BUTTONS } from "./game-wizard.constants";

export class GameWizard {
    #player;
    #settingsWizards = {};
    #gameSettings = {};

    constructor(onClose, submitGame) {
        this.onClose = onClose;
        this.submitGame = submitGame;
        this.player = new Player(self.user.id, self.user.username);
        this.init();
    }

    set player(player) {
        this.#player = player;
    }

    get player() {
        return this.#player;
    }

    get wizardTitleElement() {
        return ElementHandler.getByID(DOM_ELEMENT_ID.wizardTitle);
    }

    get wizardContentElement() {
        return ElementHandler.getByID(DOM_ELEMENT_ID.wizardContent);
    }

    get wizardActionsElement() {
        return ElementHandler.getByID(DOM_ELEMENT_ID.wizardActions);
    }

    get playBtn() {
        return ElementHandler.getByID(DOM_ELEMENT_ID.playButton);
    }

    initGameSettings() {
        this.setLevelSettings();
        this.setOptionsSettings();
    }

    setLevelSettings() {
        const currentLevelSettings = LocalStorageHelper.retrieve("levelSettings");
        const levelSettings = new LevelSettings();
        if (currentLevelSettings) {
            levelSettings.update(currentLevelSettings);
        }
        this.setGameSettings("levelSettings", levelSettings);
    }

    setOptionsSettings() {
        this.setGameSettings("optionsSettings", this.getInitialOptionsSettings());
    }

    getInitialOptionsSettings() {
        const currentOptionsSettings = LocalStorageHelper.retrieve("optionsSettings");
        const optionsSettings = new OptionsSettings();
        if (currentOptionsSettings) {
            const updateData = {};
            Object.keys(optionsSettings).forEach(key => {
                if (currentOptionsSettings[key] !== undefined) {
                    updateData[key] = currentOptionsSettings[key];
                }
            });
            optionsSettings.update(updateData);
        }
        return optionsSettings;
    }

    setGameSettings(name, settings) {
        delete this.#gameSettings[name];
        this.#gameSettings[name] = settings;
    }

    getGameSettings(name) {
        return this.#gameSettings[name];
    }

    setSettingsWizards(name, wizard) {
        delete this.#settingsWizards[name];
        this.#settingsWizards[name] = wizard;
    }

    get settingsWizards() {
        return Object.values(this.#settingsWizards);
    }

    get gameSettings() {
        return this.#gameSettings;
    }

    getSettingsWizardByName(key) {
        return this.#settingsWizards[key];
    }

    get optionsSettings() {
        return this.getGameSettings("optionsSettings");
    }

    get levelSettings() {
        return this.getSettingsWizardByName("levelSettings").settings;
    }

    get gameParams() {
        return {
            id: this.type,
            levelSettings: this.levelSettings,
            optionsSettings: this.optionsSettings
        };
    }

    getOptionsControllerParams(type) {
        return {
            name: type,
            value: this.optionsSettings[type],
        };
    }

    generateOptionsControllers() {
        const controllers = [];
        Object.keys(this.optionsSettings).forEach(key => {
            const params = this.getOptionsControllerParams(key);
            controllers.push(new Switcher(params, this.onOptionSettingChange.bind(this)));
        });
        return controllers;
    }

    onOptionSettingChange(params) {
        const updateData = {};
        updateData[params.name] = params.value;
        this.optionsSettings.update(updateData);
        LocalStorageHelper.save("optionsSettings", this.optionsSettings);
    }

    generateWizard() {
        const wizardContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.wizardContainer]);
        wizardContainer.append(this.generateWizardHeader());
        const wizardContent = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.wizardContent], DOM_ELEMENT_CLASS.wizardContent);
        this.renderWizardContent(wizardContent);
        wizardContainer.append(wizardContent);
        wizardContainer.append(this.generateWizardActions());
        return wizardContainer;
    }

    generateWizardHeader() {
        const wizardHeader = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.wizardHeader]);
        const closeBnt = ElementGenerator.generateButton(BUTTONS.close, this.onClose.bind(this));
        wizardHeader.append(this.generateWizardTitle(), closeBnt);
        return wizardHeader;
    }

    generateWizardTitle() {
        const wizardTitle = document.createElement("h2");
        ElementHandler.setID(wizardTitle, DOM_ELEMENT_ID.wizardTitle);
        wizardTitle.innerHTML = this.title;
        return wizardTitle;
    }

    generateWizardActions() {
        const actionsContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.actionsContainer], DOM_ELEMENT_ID.wizardActions);
        this.addActions(actionsContainer);
        return actionsContainer;
    }

    addActions(actionsContainer) {
        const buttons = this.getWizardActionButtons();
        buttons.forEach(button => actionsContainer.append(button));
    }

    generateResetButton() {
        return ElementGenerator.generateButton(BUTTONS.reset, this.onReset.bind(this));
    }

    generatePlayButton() {
        return ElementGenerator.generateButton(this.playButtonParams, this.onPlay.bind(this));
    }

    onLevelValidation(valid) {
        if (this.submissionPrevented !== !valid) {
            this.submissionPrevented = !valid;
            this.updateSubmissionButton();
        }
    }

    // OVERRIDEN FUNCTIONS
    get title() {
        return TYPOGRAPHY.emptyString;
    }

    get type() {
        return undefined;
    }

    get playButtonParams() {
        return BUTTONS.play;
    }

    init() {
        this.submissionPrevented = false;
        this.initGameSettings();
        // level wizard
        const levelWizard = new LevelWizard(this.onLevelValidation.bind(this), this.getGameSettings("levelSettings"));
        this.setSettingsWizards("levelSettings", levelWizard);
        // options wizard
        const optionsWizard = new OptionsWizard(this.getGameSettings("optionsSettings"), this.generateOptionsControllers());
        this.setSettingsWizards("optionsSettings", optionsWizard);
    }

    renderWizardContent(wizardContent) {}

    getWizardActionButtons() {
        return [];
    }

    resetWizard() { }

    onReset() { }

    onPlay() {}

    updateSubmissionButton() { }
}
