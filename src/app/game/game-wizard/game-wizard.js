'use strict';
import './game-wizard.scss';
import { GameType } from 'GAME_ENUMS';
import { HEADER, DOM_ELEMENT_CLASS } from './game-wizard.constants';
import { ElementGenerator, ElementHandler, ButtonGenerator, CustomElementHelper } from 'UI_ELEMENTS';


import { LevelSettings } from './../game-settings/level-settings/level-settings';
import { OptionsSettingsOriginal } from './../game-settings/options-settings/options-settings-original/options-settings-original';

// const GameType = {
//     Online: 'online',
//     Bot: 'bot',
//     Friend: 'friend',
//     Original: 'original',
//   };

export default class GameWizard {

    constructor() {
        this.type = GameType.Original;

    }

    render() {
        const fragment = document.createDocumentFragment();
        console.log('GameWizard');
        // header
        const header = this.#generateHeader();
        fragment.append(header);
        // content -- original
        this.levelSettings = new LevelSettings();
        this.optionsSettings = new OptionsSettingsOriginal();

        fragment.append(this.levelSettings.render());
        fragment.append(this.optionsSettings.render());

        // actions
        const buttonsContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.buttonsContainer]);
        const clearbtn = ButtonGenerator.generateTextButton('reset', this.#onReset.bind(this));
        buttonsContainer.append(clearbtn);
        const playbtn = ButtonGenerator.generateTextButton('play', this.#onPlay.bind(this));
        buttonsContainer.append(playbtn);

        fragment.append(buttonsContainer);

        return fragment;
    }

    init() {
        this.levelSettings.init();
        this.optionsSettings.init();
    }

    #generateHeader(type = this.type) {
        const header = document.createElement('h1');

        header.innerHTML = `<span>${HEADER[type]}</span>`;
        ElementHandler.addStyleClass(header, DOM_ELEMENT_CLASS.header);

        const button = ButtonGenerator.generateIconButtonClose(this.#onClose.bind(this));
        header.append(button);

        return header;
    }


    #onClose() {
        console.log('onClose');
    }


    #onReset() {
        console.log('onReset');
    }

    #onPlay() {
        console.log('onPlay');
        console.log(this.levelSettings.settings);
        console.log(this.optionsSettings.settings);
    }
}
