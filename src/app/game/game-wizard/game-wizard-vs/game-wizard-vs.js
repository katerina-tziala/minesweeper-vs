'use strict';
// import { GameType } from 'GAME_ENUMS';
import { ElementGenerator, ButtonGenerator } from 'UI_ELEMENTS';
// import { LevelSettings, OptionsSettingsOriginal } from '../../game-settings/@game-settings.module';
// import { HEADER } from '../game-wizard.constants';
import { GAME_MODE_STEPS } from './game-wizard-vs.constants';
// import { GameWizardHelper } from '../game-wizard-helper';
// import { User } from '../../../_models/user';

import { HEADER, DOM_ELEMENT_CLASS } from '../game-wizard.constants';
import { GameWizard } from '../game-wizard';
import { replaceStringParameter } from 'UTILS';

import { WizardStepper } from '~/components/wizard-stepper/wizard-stepper';


// const GameType = {
// Online: 'online',
// Bot: 'bot',
// Friend: 'friend',
//   };
export class GameWizardVS extends GameWizard {
    type;

    constructor(onPlay, onClose) {
        super(onPlay, onClose);
        this.wizardStepper = new WizardStepper();
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
        const steps = this.modeSettingsTypes.map(value => {
            return { value, selected: false };
        });

        if (steps.every(step => !step.selected)) {
            steps[0].selected = true;
        }

        return steps;
    }


    generateContent() {
        const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.container], DOM_ELEMENT_CLASS.container);
        // console.log('GameWizardVS');

        const steps = this.settingsSteps;
        //console.log(steps);
        this.wizardStepper.steps = steps;
       
        container.append(this.wizardStepper.generate());
        // console.log('content');
        // console.log('buttons');
        return container;
    }

    init() {
        console.log('init GameWizardVS');
        // // TODO: init from local storage
        // this.levelSettings.init();
        // this.optionsSettings.init();
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
