'use strict';
import { THEME, MINETYPE } from '../enums/app-settings.enums';
import { getRandomValueFromArray } from '../utils';
import { COLOR_TYPES } from '../constants/ui.constants';

export class AppSettingsModel {
    #theme;
    #mineType;
    #playerColorType;
    #opponentColorType;

    constructor() {
        this.theme = THEME.Default;
        this.mineType = getRandomValueFromArray(Object.values(MINETYPE));
        this.playerColorType = this.generateColorType(this.opponentColorType);
        this.opponentColorType = this.generateColorType(this.playerColorType);
    }

    get theme() {
        return this.#theme;
    }

    get mineType() {
        return this.#mineType;
    }

    get playerColorType() {
        return this.#playerColorType;
    }

    get opponentColorType() {
        return this.#opponentColorType;
    }

    set theme(theme) {
        return this.#theme = theme;
    }

    set mineType(type) {
        return this.#mineType = type;
    }

    set playerColorType(type) {
        this.#playerColorType = type;
    }

    set opponentColorType(type) {
        this.#opponentColorType = type;
    }

    generateColorType(typeToExclude) {
        let types = COLOR_TYPES.filter(type => type !== typeToExclude);
        return getRandomValueFromArray(types);
    }

    update(updateData) {
        Object.keys(updateData).forEach(property => this[property] = updateData[property]);
    }

}
