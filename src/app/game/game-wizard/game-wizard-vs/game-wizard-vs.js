'use strict';
import { GameType, GameMode } from 'GAME_ENUMS';
import { ElementGenerator, ElementHandler } from 'UI_ELEMENTS';
import { replaceStringParameter, lastPositionInArray, LocalStorageHelper } from 'UTILS';
import { DOM_ELEMENT_CLASS, GAME_MODE_STEPS, STEPS_ARIA } from './game-wizard-vs.constants';
import { GameWizard } from '../game-wizard';
import { GameWizardActions } from '../game-wizard-actions/game-wizard-actions';
import { GameWizardVsSettingsController as SettingsController } from './game-wizard-vs-settings-controller/game-wizard-vs-settings-controller';
import { WizardSteps } from './wizard-steps.enum';


export class GameWizardVS extends GameWizard {
    mode;
    opponent;
    baseSteps = [];
    #wizardStepper;
    #selectedStep;
    #settingsController;
    #minHeight = 180;

    constructor(opponent) {
        super();
        this.opponent = opponent;
        this.type = GameType.Bot;
        this.mode = GameMode.Clear;
        this.actionsHandler = new GameWizardActions({
            play: this.#onPlay.bind(this),
            reset: this.#onReset.bind(this),
            next: this.#onNextStep.bind(this),
            previous: this.#onPreviousStep.bind(this)
        });
    }

    get #container() {
        return document.getElementById(DOM_ELEMENT_CLASS.container);
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

    get gameSettings() {
        return this.#settingsController ? this.#settingsController.gameSettings : undefined;
    }

    get gameSetup() {
        const gameSettings = this.gameSettings;
        if (gameSettings) {
            gameSettings.type = this.type;
            gameSettings.mode = this.mode;
            gameSettings.opponent = this.opponent;
        }
        return gameSettings;
    }

    setConfig() {
        this.#settingsController = new SettingsController(this.type);
        this.baseSteps = [WizardSteps.Mode];
    }

    setHeaderText() {
        super.setHeaderText();
        const { username } = this.opponent;
        this.header = replaceStringParameter(this.header, `<i>${username}</i>`);
    }

    generateContent() {
        this.#setWizardStepper();
        const fragment = document.createDocumentFragment();
        const stepContainer = this.#generateStepContainer();
        fragment.append(this.#wizardStepper, stepContainer);
        return fragment;
    }

    init() {
        this.#settingsController.gameSettings = LocalStorageHelper.getGameSetUp(this.type);
        const selectedMode = this.#settingsController.selectedMode;
        if (selectedMode) {
            this.mode = selectedMode;
        }
        this.#setUpStepper();
    }

    #setWizardStepper() {
        this.#wizardStepper = document.createElement('app-wizard-stepper');
        this.#wizardStepper.setAttribute('name', 'gameSettings');
        this.#wizardStepper.addEventListener('onStepSelected', (event) => this.#onStepSelection(event.detail));
        this.#wizardStepper.addEventListener('onRemoveFocus', () => this.#settingsController.focusOnPanel(this.#selectedStep));
    }

    #generateStepContainer() {
        const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.container], DOM_ELEMENT_CLASS.container);
        const stepContainer = this.generateContentContainer();
        stepContainer.append(this.#settingsController.generate());

        const buttons = this.actionsHandler.generate();
        container.append(stepContainer, buttons);
        return container;
    }

    #updateSelectedStepIndex() {
        if (this.#selectedStep) {
            this.#selectedStep.index = this.stepTypes.indexOf(this.#selectedStep.name);
        }
    }

    #setUpStepper() {
        const steps = this.settingsSteps;
        this.#updateSelectedStepIndex();
        const lastIndex = lastPositionInArray(steps);
        const currentIndex = this.#selectedStep ? this.#selectedStep.index : 0;
        this.#wizardStepper.setSteps(steps);
        this.actionsHandler.init(lastIndex, currentIndex);
    }

    #modeHasTurns(mode) {
        const modeSteps = GAME_MODE_STEPS[mode];
        return modeSteps.includes(WizardSteps.Turns);
    }

    updateMode(selectedMode = GameMode.Clear) {
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
        this.actionsHandler.onIndexUpdate(index);
    }

    #checkModeUpdate() {
        const selectedMode = this.#settingsController.selectedMode;
        if (this.#selectedStep.name !== WizardSteps.Mode && selectedMode) {// mode is configured
            this.updateMode(selectedMode);
        }
    }

    #checkSelectedStepUpdate(selectedStep) {
        if (this.#selectedStep.name === selectedStep.name) {
            return;
        }
        this.#setWizardHeight();
        this.#settingsController.updateSettingsInProgress();
        this.#selectedStep = selectedStep;
        this.#checkModeUpdate();
        this.#animateWizard(() => this.#updateStepContent());
    }

    #updateStepContent() {
        this.#settingsController.initController(this.#selectedStep);
        this.#updateActions();
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
            this.updateMode();
        }
    }

    #onPlay() {
        this.#settingsController.updateSettingsInProgress();
        LocalStorageHelper.saveGameSetUp(this.type, this.gameSettings);
        const gameConfig = this.gameSetup;
        this.onPlayGame(gameConfig);
    }

}
