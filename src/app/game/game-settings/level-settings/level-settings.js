'use strict';
import { SETTINGS_PROPERTIES, LEVEL_ARIA } from './level-settings.constants';
import { GameLevel } from 'GAME_ENUMS';
import { LEVEL_PARAMS, BOUNDARIES } from './level-settings-config';
import GameSettings from '../game-settings';
import { GameSettingsElementHelper as ElementHandler } from '../game-settings-element-helper';

export class LevelSettings extends GameSettings {
    #levelProperties;
    constructor() {
        super();
        this.#levelProperties = Object.values(SETTINGS_PROPERTIES);
        this.inputListeners.set('level', this.#onLevelChange.bind(this));
        this.inputListeners.set('rows', this.#onBoardChange.bind(this));
        this.inputListeners.set('columns', this.#onBoardChange.bind(this));
        this.inputListeners.set('numberOfMines', this.onPropertyChange.bind(this));
    }

    get #isCustomLevel() {
        return this.#level === GameLevel.Custom;
    }

    get #level() {
        return this.settings ? this.settings.level : GameLevel.Beginner;
    }

    get #levelOptions() {
        return Object.keys(GameLevel).map(key => {
            const value = GameLevel[key];
            const selected = value === this.#level;
            const ariaLabel = LEVEL_ARIA[key];
            const displayValue = `<span>${value}</span>`;
            return { value, selected, ariaLabel, displayValue };
        });
    }

    get #numberOfMinesBoundaries() {
        const numberOfBoardTiles = this.settings.rows * this.settings.columns;
        const boundaries = { ...BOUNDARIES.numberOfMines };
        boundaries.max = Math.floor(numberOfBoardTiles * BOUNDARIES.maxMinesPercentage);
        boundaries.min = Math.ceil(numberOfBoardTiles * BOUNDARIES.minMinesPercentage);
        return boundaries;
    }

    initInputHandlers() {
        super.initInputHandlers();
        this.setSelectFieldsHandlers(['level']);
        this.setNumberFieldsHandlers(this.#levelProperties);
    }

    render() {
        this.initInputHandlers();
        return super.render('level');
    }

    init(settings) {
        this.#setSettings(settings);
        const options = this.#levelOptions;
        this.resetSelectField('level', false, options);
        this.#initLevelParams();
    }

    #getDefaultSettings(level = GameLevel.Beginner) {
        const params = this.#getLevelParams(level);
        return { level, ...params };
    }

    #setSettings(settings) {
        this.settings = settings || this.#getDefaultSettings();
    }

    #getLevelParams(level = GameLevel.Beginner) {
        return LEVEL_PARAMS[level];
    }

    #initLevelParams() {
        const disabled = !this.#isCustomLevel;
        this.#levelProperties.forEach(type => {
            const boundaries = type === SETTINGS_PROPERTIES.numberOfMines ? this.#numberOfMinesBoundaries : BOUNDARIES.board;
            this.resetNumberField(type, disabled, boundaries);
        });
    }

    #checkMinesBoundaries() {
        const newBoundaries = this.#numberOfMinesBoundaries;
        const input = ElementHandler.getInputField(SETTINGS_PROPERTIES.numberOfMines);
        ElementHandler.setNumberInputBoundaries(input, newBoundaries);
    }

    #onBoardChange({ detail }) {
        this.updateSettings(detail);
        this.#checkMinesBoundaries();
    }

    #onLevelChange({ detail }) {
        const { name, value } = detail;
        const settings = this.#getDefaultSettings(value);
        settings[name] = value;
        this.settings = settings;
        this.#initLevelParams();
    }

}
