'use strict';
import { enumKey } from 'UTILS';
import { ElementHandler, ElementGenerator, TemplateGenerator } from 'UI_ELEMENTS';
import { GameType, GameMode } from 'GAME_ENUMS';
import * as GAME_SETTINGS from 'GAME_SETTINGS';
import { DOM_ELEMENT_CLASS, CONTROLLER_NAME, PANEL_TEMPLATE } from './game-wizard-vs-settings-controller.constants';
import { WizardSteps } from '../wizard-steps.enum';

export class GameWizardVsSettingsController {
    #settingsContainer;
    #controller;
    #settingsName;
    #gameSettings = new Map();
    #excludeParallel;

    constructor(type) {
        this.#excludeParallel = type === GameType.Friend;
    }

    get #settings() {
        const settings = this.#controller ? this.#controller.settings : undefined;
        const name = this.#settingsName;
        if (settings && name) {
            return { name, settings };
        }
        return undefined;
    }

    get #controllerSettings() {
        return this.#gameSettings.get(this.#settingsName);
    }

    set gameSettings(gameSettings) {
        this.#gameSettings = new Map();

        if (gameSettings) {
            for (const [key, settings] of Object.entries(gameSettings)) {
                this.#gameSettings.set(key, settings);
            }
        }
    }

    get selectedMode() {
        const modeSettings = this.#gameSettings.get(WizardSteps.Mode);
        return modeSettings ? modeSettings.gameMode : undefined;
    }

    get gameSettings() {
        if (this.#gameSettings.size) {
            const gameSettings = {};
            for (const [name, settings] of this.#gameSettings) {
                gameSettings[name] = settings;
            }
            return gameSettings;
        }
        return undefined;
    }

    generate() {
        this.#settingsContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.container], DOM_ELEMENT_CLASS.container);
        return this.#settingsContainer;
    }

    initController(settingStep) {
        ElementHandler.clearContent(this.#settingsContainer);

        const { name, ariaLabel, controls } = settingStep;
        this.#settingsName = name;
        this.#controller = this.#getController(name);
        if (!this.#controller) {
            throw new Error('could not load game controller');
        }

        this.#renderController(ariaLabel, controls);
    }

    updateSettingsInProgress() {
        const currentSettings = this.#settings;
        if (currentSettings) {
            const { name, settings } = currentSettings;
            this.#gameSettings.set(name, settings);
        }
    }
    resetCurrentSettings() {
        if (this.#settingsName && this.#controller) {
            this.#gameSettings.delete(this.#settingsName);
            this.#controller.init(this.#controllerSettings);
        }
    }

    focusOnPanel(settingStep) {
        const id = settingStep ? settingStep.controls : '';
        const panel = document.getElementById(id);
        if (panel) {
            panel.focus();
        }
    }

    #renderController(ariaLabel, id) {
        const panel = this.#getControllerPanel({ ariaLabel, id });
        this.#settingsContainer.append(panel);
        this.#controller.init(this.#controllerSettings);
    }

    #getControllerPanel(content) {
        const template = TemplateGenerator.generate(PANEL_TEMPLATE, content);
        const panel = template.children[0];
        panel.append(this.#controller.render());
        return panel;
    }

    #getController(stepName) {
        if (stepName === WizardSteps.Options) {
            return this.#getOptionsController();
        }
        return this.#getControllerByName(stepName);
    }

    #getControllerByName(stepName) {
        const constrollerName = CONTROLLER_NAME[stepName];
        if (stepName === WizardSteps.Mode) {
            return new GAME_SETTINGS[constrollerName](this.#excludeParallel);
        }
        return new GAME_SETTINGS[constrollerName]();
    }

    #getOptionsController() {
        if (!this.selectedMode) {
            return;
        }
        let constrollerName = CONTROLLER_NAME[WizardSteps.Options];
        constrollerName += enumKey(GameMode, this.selectedMode);
        return new GAME_SETTINGS[constrollerName]();
    }

}
