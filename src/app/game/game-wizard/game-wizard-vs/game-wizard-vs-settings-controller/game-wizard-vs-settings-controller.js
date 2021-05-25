'use strict';
import { enumKey } from 'UTILS';
import { ElementHandler, ElementGenerator, TemplateGenerator } from 'UI_ELEMENTS';
import { GameMode } from 'GAME_ENUMS';
import * as GAME_SETTINGS from 'GAME_SETTINGS';
import { DOM_ELEMENT_CLASS, CONTROLLER_NAME, PANEL_TEMPLATE } from './game-wizard-vs-settings-controller.constants';
import { WizardSteps } from '../wizard-steps.enum';

export class GameWizardVsSettingsController {
    #settingsContainer;
    #controller;
    #settingsName;
    #gameSettings = new Map();
    #type;

    constructor(type) {
        this.#type = type;
        console.log('GameWizardVsSettingsController', this.#type);
    }

    set gameSettings(gameSettings) {
        this.#gameSettings = new Map();

        if (gameSettings) {
            for (const [key, settings] of Object.entries(gameSettings)) {
                this.#gameSettings.set(key, settings);
            }
        }
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
        const { name, ariaLabel, controls } = settingStep;
        this.#settingsName = name;
        ElementHandler.clearContent(this.#settingsContainer);

        this.#controller = this.#getController(name);
        if (!this.#controller) {
            throw new Error('could not load game controller');
        }

        const panel = this.#getControllerPanel({ ariaLabel, id: controls });
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
        const constrollerName = CONTROLLER_NAME[stepName];
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

}
