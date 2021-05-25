'use strict';
import { GameType, GameMode } from 'GAME_ENUMS';
import { ElementHandler, ElementGenerator, HeightAnimation } from 'UI_ELEMENTS';
import { replaceStringParameter, lastPositionInArray } from 'UTILS';

import { GAME_MODE_STEPS, DOM_ELEMENT_CLASS, STEPS_ARIA } from './game-wizard-vs.constants';
import { HEADER } from '../game-wizard.constants';
import { GameWizard } from '../game-wizard';

import { GameWizardActions } from '../game-wizard-actions/game-wizard-actions';
import { GameWizardVsSettingsController as SettingsController } from './game-wizard-vs-settings-controller/game-wizard-vs-settings-controller';
import { WizardSteps } from './wizard-steps.enum';

export class GameWizardVS extends GameWizard {
    type;
    mode;
    baseSteps = [];
    #wizardStepper;
    #actionsHandler;
    #selectedStep;
    #settingsController;
    #minHeight;

    constructor(onPlay, onClose) {
        super(onPlay, onClose);
        this.#minHeight = 180;
        this.#actionsHandler = new GameWizardActions({
            play: this.#onPlay.bind(this),
            reset: this.#onReset.bind(this),
            next: this.#onNextStep.bind(this),
            previous: this.#onPreviousStep.bind(this)
        });
        this.#settingsController = new SettingsController();
    }

    get modeSettingsTypes() {
        return GAME_MODE_STEPS[this.mode] || [];
    }

    get stepTypes() {
        return [...this.baseSteps, ...this.modeSettingsTypes];
    }

    get settingsSteps() {
        const selectedIndex = this.#selectedStep ? this.stepTypes.indexOf(this.#selectedStep.name) : -1;

        return this.stepTypes.map((name, index) => {
            const selected = index === selectedIndex;
            const visited = selectedIndex < 0 ? false : index <= selectedIndex;
            return { name, selected, visited, ariaLabel: STEPS_ARIA[name] };
        });
    }

    get #container() {
        return document.getElementById(DOM_ELEMENT_CLASS.container);
    }

    // check defaults
    setConfig() {
        this.baseSteps = [WizardSteps.Mode];
    }

    setHeaderText() {
        const header = HEADER[this.type];
        const { username } = this.opponent;
        this.header = replaceStringParameter(header, `<i>${username}</i>`);
    }

    #setWizardStepper() {
        this.#wizardStepper = document.createElement('app-wizard-stepper');
        this.#wizardStepper.setAttribute('name', 'gameSettings');
        this.#wizardStepper.addEventListener('onStepSelected', (event) => this.#onStepSelection(event.detail));
    }

    #generateStepContainer() {
        const stepContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.container], DOM_ELEMENT_CLASS.container);
        const settingsContainer = this.#settingsController.generate();
        const buttons = this.#actionsHandler.generate();
        stepContainer.append(settingsContainer, buttons);
        return stepContainer;
    }

    generateContent() {
        this.#setWizardStepper();
        const fragment = document.createDocumentFragment();
        const stepContainer = this.#generateStepContainer();
        fragment.append(this.#wizardStepper, stepContainer);
        return fragment;
    }


    init() {
        // // TODO: init from local storage
        this.#setUpStepper();
    }

    #setUpStepper() {
        const steps = this.settingsSteps;
        const lastIndex = lastPositionInArray(steps);
        this.#wizardStepper.setSteps(steps);
        this.#actionsHandler.init(lastIndex);
    }

    #modeHasTurns(mode) {
        const modeSteps = GAME_MODE_STEPS[mode];
        return modeSteps.includes(WizardSteps.Turns);
    }

    #updateMode(selectedMode = GameMode.Clear) {
        if (this.mode === selectedMode) {
            return;
        }
        const currentModeHasTurns = this.#modeHasTurns(this.mode);
        const selectedModeHasTurns = this.#modeHasTurns(selectedMode);
        this.mode = selectedMode;

        if (currentModeHasTurns !== selectedModeHasTurns) {
            this.#setUpStepper();
        }
    }

    #updateActions() {
        const index = this.#selectedStep.index;
        this.#actionsHandler.onIndexUpdate(index);
    }

    #checkSelectedStepUpdate(selectedStep) {
        if (this.#selectedStep.name === selectedStep.name) {
            return;
        }
        this.#setWizardHeight();
        this.#settingsController.updateSettingsInProgress();
        this.#animateWizard(() => {
            this.#selectedStep = selectedStep;
            const { name } = selectedStep;

            if (name === WizardSteps.Level) {// mode is configured
                this.#updateMode(this.#settingsController.selectedMode);
            }
            this.#updateStepContent();
        });
    }

    #updateStepContent() {
        this.#updateActions();
        this.#settingsController.initController(this.#selectedStep);
        this.#setWizardHeight(ElementHandler.getElementHeight(this.#container));
    }

    #onStepSelection(selectedStep) {
        if (!this.#selectedStep) {
            this.#settingsController.updateSettingsInProgress();
            this.#selectedStep = selectedStep;
            this.#updateStepContent();
        } else {
            this.#checkSelectedStepUpdate(selectedStep);
        }
    }

    #onPreviousStep() {
        this.#settingsController.updateSettingsInProgress();
        if (this.#wizardStepper) {
            this.#wizardStepper.selectPrevious();
        }
    }

    #onNextStep() {
        this.#settingsController.updateSettingsInProgress();
        if (this.#wizardStepper) {
            this.#wizardStepper.selectNext();
        }
    }

    #setWizardHeight(addition = 0) {
        const height = this.#minHeight + addition;
        ElementHandler.updateElementStyles(this.wizardContainer, { height: `${height}px` });
    }

    #animateWizard(callBack) {
        const transitionEnd = (event) => {
            const id = event.target.getAttribute('id');
            if (id === this.wizardId) {
                callBack();
                this.wizardContainer.removeEventListener('transitionend', transitionEnd);
            }
        }
        this.wizardContainer.addEventListener('transitionend', transitionEnd);
    }

    #onReset() {
        this.#settingsController.resetCurrentSettings();
        if (this.selectedStep && this.selectedStep.name === WizardSteps.Mode) {
            this.#updateMode();
        }
    }



    
    #onPlay() {
        this.#settingsController.updateSettingsInProgress();
        console.log('onPlay');
        console.log(this.#settingsController.gameSettings);
    }

    // #onPlay() {
    //     const level = { ...this.levelSettings.settings };
    //     const options = { ...this.optionsSettings.settings };
    //     const settings = { mode: this.#gameType, level, options };
    //     if (this.#submitSettings) {
    //         this.#submitSettings(settings);
    //     }
    // }

}
