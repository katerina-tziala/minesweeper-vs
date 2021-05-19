'use strict';
import { GameType } from 'GAME_ENUMS';
import { ElementGenerator, ButtonGenerator } from 'UI_ELEMENTS';
import { LevelSettings, OptionsSettingsOriginal } from '../../game-settings/@game-settings.module';
import { HEADER, DOM_ELEMENT_CLASS } from '../game-wizard.constants';
import { GameWizard } from '../game-wizard';

export class GameWizardOriginal extends GameWizard {
    header;
    #type;

    constructor(onPlay, onClose) {
        super(onPlay, onClose);
        this.#type = GameType.Original;
        this.header = HEADER[this.#type];
        this.levelSettings = new LevelSettings();
        this.optionsSettings = new OptionsSettingsOriginal();
    }

    generateContent() {
        const fragment = document.createDocumentFragment();
        fragment.append(this.levelSettings.render());
        fragment.append(this.optionsSettings.render());
        fragment.append(this.#generateActions());
        return fragment;
    }

    init() {
        console.log('init original');
        // TODO: init from local storage
        this.levelSettings.init();
        this.optionsSettings.init();
    }

    #generateActions() {
        const buttonsContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.buttonsContainer]);
        const clearbtn = ButtonGenerator.generateTextButton('reset', this.onReset.bind(this));
        buttonsContainer.append(clearbtn);
        const playbtn = ButtonGenerator.generateTextButton('play', this.#submitSettings.bind(this));
        buttonsContainer.append(playbtn);
        return buttonsContainer;
    }

    #submitSettings() {
        const level = { ...this.levelSettings.settings };
        const options = { ...this.optionsSettings.settings };
        const settings = { type: this.#type, mode: this.#type, level, options };
        this.onPlayGame(settings);
    }
}
