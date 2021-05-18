'use strict';
import { GameType } from 'GAME_ENUMS';
import { ElementGenerator, ButtonGenerator } from 'UI_ELEMENTS';
import { LevelSettings, OptionsSettingsOriginal } from '../../game-settings/@game-settings.module';
import { HEADER } from '../game-wizard.constants';
import { DOM_ELEMENT_CLASS } from './game-wizard-vs.constants';
import { GameWizardHelper } from '../game-wizard-helper';
// const GameType = {
//     Online: 'online',
//     Bot: 'bot',
//     Friend: 'friend',
//     Original: 'original',
//   };

export class GameWizardVS {
    #header;
    #gameType;
    #submitSettings;

    constructor(submitSettings) {
        this.#submitSettings = submitSettings;
        this.#gameType = GameType.Bot;
        this.#header = HEADER[this.#gameType];

        // this.levelSettings = new LevelSettings();
        // this.optionsSettings = new OptionsSettingsOriginal();
    }

    get wizardContainer() {
        return document.getElementById(DOM_ELEMENT_CLASS.container);
    }

    generate() {
        console.log('GameWizardVS');
        const fragment = document.createDocumentFragment();


        fragment.append(GameWizardHelper.generateHeader(this.#header));
        // fragment.append(this.levelSettings.render());
        // fragment.append(this.optionsSettings.render());
        // fragment.append(this.#generateActions());
        return fragment;
    }

    init() {
        console.log('GameWizardVS');
        // // TODO: init from local storage
        // this.levelSettings.init();
        // this.optionsSettings.init();
    }
    // #generateContent() {
    //     const container = ElementGenerator.generateContainer([], DOM_ELEMENT_CLASS.wizardContent);
    //     container.append(this.wizardHandler.generate());
    //     return container;
    // }
    // #generateActions() {
    //     const buttonsContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.buttonsContainer]);
    //     const clearbtn = ButtonGenerator.generateTextButton('reset', this.#onReset.bind(this));
    //     buttonsContainer.append(clearbtn);
    //     const playbtn = ButtonGenerator.generateTextButton('play', this.#onPlay.bind(this));
    //     buttonsContainer.append(playbtn);
    //     return buttonsContainer;
    // }

    // #onReset() {
    //     console.log('-- reset wizard');
    //     // TODO reset storage
    //     this.init();
    // }

    // #onPlay() {
    //     const level = { ...this.levelSettings.settings };
    //     const options = { ...this.optionsSettings.settings };
    //     const settings = { mode: this.#gameType, level, options };
    //     if (this.#submitSettings) {
    //         this.#submitSettings(settings);
    //     }
    // }
}
