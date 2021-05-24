'use strict';
// import { GameType } from 'GAME_ENUMS';
import { ElementGenerator, ButtonGenerator } from 'UI_ELEMENTS';
// import { LevelSettings, OptionsSettingsOriginal } from '../../game-settings/@game-settings.module';
// import { HEADER } from '../game-wizard.constants';
import { STEPS, GAME_MODE_STEPS, DOM_ELEMENT_CLASS, STEPS_ARIA } from './game-wizard-vs.constants';
// import { GameWizardHelper } from '../game-wizard-helper';
// import { User } from '../../../_models/user';

import { HEADER } from '../game-wizard.constants';
import { GameWizard } from '../game-wizard';
import { replaceStringParameter, lastPositionInArray } from 'UTILS';
import { GameWizardActions } from '../game-wizard-actions/game-wizard-actions';




// const GameType = {
// Online: 'online',
// Bot: 'bot',
// Friend: 'friend',
//   };
export class GameWizardVS extends GameWizard {
    type;
    mode;
    baseSteps = [];
    wizardStepper;
    #actionsHandler;
    #selectedStep;

    constructor(onPlay, onClose) {
        super(onPlay, onClose);
        this.baseSteps = [STEPS.mode];
        this.#actionsHandler = new GameWizardActions({
            play: this.#onPlay.bind(this),
            reset: this.#onReset.bind(this),
            next: this.#onNextStep.bind(this),
            previous: this.#onPreviousStep.bind(this)
        });
    }

    get modeSettingsTypes() {
        return GAME_MODE_STEPS[this.mode] || [];
    }

    get contentContainer() {
        return document.getElementById(DOM_ELEMENT_CLASS.container);
    }

    setConfig() {
        this.setHeaderText();

    }

    setHeaderText() {
        const header = HEADER[this.type];
        const { username } = this.opponent;
        this.header = replaceStringParameter(header, `<i>${username}</i>`);
    }


    get settingsSteps() {
        const stepTypes = [...this.baseSteps, ...this.modeSettingsTypes];

        const steps = stepTypes.map(name => {
            return { name, selected: false, ariaLabel: STEPS_ARIA[name] };
        });

        //disabled: false, visited: false
        // if (steps.every(step => !step.selected)) {
        //     steps[0].selected = true;
        // }

        return steps;
    }


    generateContent() {
        const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.container], DOM_ELEMENT_CLASS.container);
        // console.log('GameWizardVS');

        this.wizardStepper = document.createElement('app-wizard-stepper');
        this.wizardStepper.setAttribute('name', 'gameSettings');
        this.wizardStepper.addEventListener('onStepSelected', (event) => this.#onStepSelected(event.detail));

        this.settingsContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.settingsContainer], DOM_ELEMENT_CLASS.settingsContainer);

        const buttons = this.#actionsHandler.generate();
        container.append(this.wizardStepper, this.settingsContainer, buttons);
        return container;
    }

    init() {
      //  console.log('init GameWizardVS');
        // // TODO: init from local storage
        const steps = this.settingsSteps;
       // console.log(steps);
        const lastIndex = lastPositionInArray(steps);
        // console.log(lastIndex);
        this.wizardStepper.setSteps(steps);
        this.#actionsHandler.init(lastIndex);
        // this.levelSettings.init();
        // this.optionsSettings.init();
    }


    #onStepSelected(selectedStep) {
        console.log('onStepSelected');
       // console.log(selectedStep);

        this.#selectedStep = selectedStep;
        const index = this.#selectedStep.index;

        // console.log(index);
        console.log(this.#selectedStep);

        
        this.#actionsHandler.onIndexUpdate(index);

        
    }


    #onPreviousStep() {
        if (this.wizardStepper) {
            this.wizardStepper.selectPrevious();
        }
    }

    #onNextStep() {
        if (this.wizardStepper) {
            this.wizardStepper.selectNext();
        }
    }

    #onReset() {
        console.log('onReset');

    }

    #onPlay() {
        console.log('onPlay');

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
