'use strict';
import { GameType } from 'GAME_ENUMS';
import { ElementGenerator, ButtonGenerator } from 'UI_ELEMENTS';
import { LevelSettings, OptionsSettingsOriginal } from '../../game-settings/@game-settings.module';
import { HEADER, DOM_ELEMENT_CLASS } from '../game-wizard.constants';
import { GameWizardHelper } from '../game-wizard-helper';

export class GameWizardOriginal {
    #header;
    #gameType;
    #submitSettings;

    constructor(submitSettings) {
        this.#submitSettings = submitSettings;
        this.#gameType = GameType.Original;
        this.#header = HEADER[this.#gameType];
        this.levelSettings = new LevelSettings();
        this.optionsSettings = new OptionsSettingsOriginal();
    }

    generate() {
        const fragment = document.createDocumentFragment();
        fragment.append(GameWizardHelper.generateHeader(this.#header));
        fragment.append(this.levelSettings.render());
        fragment.append(this.optionsSettings.render());
        fragment.append(this.#generateActions());
        return fragment;
    }

    init() {
        // TODO: init from local storage
        this.levelSettings.init();
        this.optionsSettings.init();
    }

    #generateActions() {
        const buttonsContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.buttonsContainer]);
        const clearbtn = ButtonGenerator.generateTextButton('reset', this.#onReset.bind(this));
        buttonsContainer.append(clearbtn);
        const playbtn = ButtonGenerator.generateTextButton('play', this.#onPlay.bind(this));
        buttonsContainer.append(playbtn);
        return buttonsContainer;
    }

    #onReset() {
        console.log('-- reset wizard');
        // TODO reset storage
        this.init();
    }

    #onPlay() {
        const level = { ...this.levelSettings.settings };
        const options = { ...this.optionsSettings.settings };
        const settings = { mode: this.#gameType, level, options };
        if (this.#submitSettings) {
            this.#submitSettings(settings);
        }
    }
}
