'use strict';
import { GameType } from 'GAME_ENUMS';
import { ElementGenerator, ButtonGenerator } from 'UI_ELEMENTS';
import { LevelSettings, OptionsSettingsOriginal } from '../../game-settings/@game-settings.module';
// import { HEADER } from '../game-wizard.constants';
// import { DOM_ELEMENT_CLASS } from './game-wizard-vs.constants';
import { GameWizardHelper } from '../game-wizard-helper';
import { User } from '../../../_models/user';

import { HEADER, DOM_ELEMENT_CLASS } from '../game-wizard.constants';
import { GameWizard } from '../game-wizard';

// const GameType = {
// Online: 'online',
// Bot: 'bot',
// Friend: 'friend',
//   };
export class GameWizardVS extends GameWizard {
    #type;

    constructor(onPlay, onClose) {
        super(onPlay, onClose);



        this.#type = GameType.Bot;

        this.header = HEADER[this.#type];

        this.oppopent = new User('MineweeperBot');
        console.log(this.oppopent);
        // Bot: bot level, mode, level, turns,  options
        // 
        // this.levelSettings = new LevelSettings();
        // this.optionsSettings = new OptionsSettingsOriginal();
    }

    get contentContainer() {
        return document.getElementById(DOM_ELEMENT_CLASS.container);
    }

    generateContent() {
        const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.container], DOM_ELEMENT_CLASS.container);
        console.log('GameWizardVS');
        console.log('stepper');
        console.log('content');
        console.log('steps');
        return container;
    }

    // generate() {
    //     console.log('GameWizardVS');
    //     const container = document.createDocumentFragment();

    //     // if (!this.opponent) {
    //     //     console.log('local playa');
    //     //     this.usernameForm = new AddUsername('addOpponent', this.#onAddPlayer.bind(this), this.#onCloseForm.bind(this));
    //     //     fragment.append(this.usernameForm.render());
    //     // }

    //    // fragment.append(GameWizardHelper.generateHeader(this.#header));
    //     // fragment.append(this.levelSettings.render());
    //     // fragment.append(this.optionsSettings.render());
    //     // fragment.append(this.#generateActions());
    //     return container;
    // }

    init() {
        console.log('GameWizardVS');
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
