'use strict';
import { SETTINGS_PROPERTIES, LEVEL_ARIA } from './level-settings.constants';
import { GameLevel } from 'GAME_ENUMS';
import { LEVEL_PARAMS, BOUNDARIES } from './level-settings-config';
import { GameSettings } from '../game-settings';

export class LevelSettings extends GameSettings {
    #levelSelect;
    #paramListeners;

    constructor() {
        super();
        this.#paramListeners = new Map();
        this.#paramListeners.set('rows', this.#onBoardChange.bind(this))
        this.#paramListeners.set('columns', this.#onBoardChange.bind(this))
        this.#paramListeners.set('numberOfMines', this.#onMinesChange.bind(this))
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
        Object.keys(SETTINGS_PROPERTIES).forEach(levelProperty => {
            const input = this.generateNumberInput(levelProperty);
            this.setInputHandler(levelProperty, input);
        });
    }

    render() {
        this.initInputHandlers();

        const fragment = document.createDocumentFragment();
        const levelContainer = this.#generateLevelInput();
        fragment.append(levelContainer);

        const inputs = this.generateInputs();
        fragment.append(inputs);
        return fragment;
    }

    init(settings) {
        this.#setSettings(settings);
        const options = this.#levelOptions;
        this.#levelSelect.setOptions(options);
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

    #generateLevelInput() {
        const levelContainer = this.generateSettingContainer('level');
        this.#levelSelect = this.generateSelectInput('level', this.#onLevelChange.bind(this));
        levelContainer.append(this.#levelSelect);
        return levelContainer;
    }

    #initLevelParams() {
        const disabled = !this.#isCustomLevel;
        for (const [name, input] of this.inputHandlers) {
            const value = this.settings[name];
            const action = this.#paramListeners.get(name);
            this.removeInputListener(input, action);
            this.setInputDisabled(input, disabled);
            const boundaries = name === SETTINGS_PROPERTIES.numberOfMines ? this.#numberOfMinesBoundaries : BOUNDARIES.board;
            this.setNumberInputBoundaries(input, boundaries);
            this.setInputValue(input, value);
            if (!disabled) {
                this.setInputListener(input, action);
            }
        }
    }

    #checkMinesBoundaries() {
        const newBoundaries = this.#numberOfMinesBoundaries;
        const input = this.getInputField(SETTINGS_PROPERTIES.numberOfMines);
        this.setNumberInputBoundaries(input, newBoundaries);
    }

    #onBoardChange({ detail }) {
        this.#updateSettings(detail);
        this.#checkMinesBoundaries();
        // console.log('onBoardChange');
        // console.log(this.settings);
    }

    #onMinesChange({ detail }) {
        this.#updateSettings(detail);
        // console.log('onMinesChange');
        // console.log(this.settings);
    }

    #updateSettings({ name, value }) {
        const settings = { ...this.settings };
        settings[name] = value;
        this.settings = settings;
    }

    #onLevelChange({ detail }) {
        const { name, value } = detail;
        const settings = this.#getDefaultSettings(value);
        settings[name] = value;
        this.settings = settings;
        this.#initLevelParams();
        // console.log(this.settings);
    }

}
