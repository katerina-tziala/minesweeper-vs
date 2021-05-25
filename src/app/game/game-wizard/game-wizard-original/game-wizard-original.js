'use strict';
import { GameType } from 'GAME_ENUMS';
import { LevelSettings, OptionsSettingsOriginal } from 'GAME_SETTINGS';
import { GameWizard } from '../game-wizard';
import { GameWizardActions } from '../game-wizard-actions/game-wizard-actions';
import { LocalStorageHelper } from 'UTILS';

export class GameWizardOriginal extends GameWizard {
    header;
    type;

    constructor(onComplete, onClose) {
        super(onComplete, onClose);
        this.type = GameType.Original;
        this.setHeaderText();
        this.levelSettings = new LevelSettings();
        this.optionsSettings = new OptionsSettingsOriginal();
        this.actionsHandler = new GameWizardActions({
            play: this.#onPlay.bind(this),
            reset: this.#onReset.bind(this)
        });
    }

    get #gameSettings() {
        const level = { ...this.levelSettings.settings };
        const options = { ...this.optionsSettings.settings };
        return { type: this.type, mode: this.type, level, options };
    }

    generateContent() {
        const fragment = document.createDocumentFragment();
        const container = this.generateContentContainer();
        container.append(this.levelSettings.render());
        container.append(this.optionsSettings.render());
        const actions = this.actionsHandler.generate();
        fragment.append(container, actions);
        return fragment;
    }

    init() {
        super.init();
        const initialSettings = LocalStorageHelper.getGameSetUp(this.type);
        let level, settings;
        if (initialSettings) {
            level = initialSettings.level;
            settings = initialSettings.settings;
        }
        this.#initSettings(level, settings);
    }

    #initSettings(level, options) {
        this.levelSettings.init(level);
        this.optionsSettings.init(options);
    }

    #onPlay() {
        const gameSettings = this.#gameSettings;
        LocalStorageHelper.saveGameSetUp(this.type, gameSettings);
        this.onPlayGame(gameSettings);
    }

    #onReset() {
        this.#initSettings();
    }
}
