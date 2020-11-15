"use strict";

import { AppModel } from "~/_models/_app-model";
import { GameLevel } from "../../_enums/game-level.enum";
import { LEVEL_PARAMS } from "./level-setting-constants";
import { sortNumbersArrayAsc } from "~/_utils/utils";

export class LevelSettings extends AppModel {

    constructor(level) {
        super();
        this.setLevel(level ? level : GameLevel.Beginner);
        this.minesPositions = [];
    }

    setLevel(level) {
        this.level = level;
        this.update(LEVEL_PARAMS[this.level]);
    }

    setMinesPositions() {
        this.minesPositions = this.generateMinesPositions();
    }

    generateMinesPositions() {
        let mineList = [];
        while (mineList.length < this.numberOfMines) {
            const minePosition = parseInt(Math.floor((Math.random() * (this.rows * this.columns))));
            if (!mineList.includes(minePosition)) {
                mineList.push(minePosition);
            }
        }
        return sortNumbersArrayAsc(mineList);
    }

}
