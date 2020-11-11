"use strict";

import { AppModel } from "./app-model";


export class LevelSettings extends AppModel {

    constructor() {
        this.level = GameLevelType.Beginner;
        this.rows = 9;
        this.columns = 9;
        this.mines = 16;
    }

    // update(updateData) {
    //     Object.keys(updateData).forEach(key => this[key] = updateData[key]);
    // }

    // getLevel() {
    //     return this.level;
    // }

    // setLevel(level) {
    //     return this.level = level;
    // }

    // getMines() {
    //     return this.mines;
    // }

    // getMinesPositions() {
    //     return this.minesPositions;
    // }

    // updateState(updateData) {
    //     Object.keys(updateData).forEach(key => this[key] = updateData[key]);
    // }

    // setMinesPositions() {
    //     this.minesPositions = this.generateMinesPositions();
    // }

    // generateMinesPositions() {
    //     let mineList = [];
    //     while (mineList.length < this.mines) {
    //         const minePosition = parseInt(Math.floor((Math.random() * (this.rows * this.columns))));
    //         if (!mineList.includes(minePosition)) {
    //             mineList.push(minePosition);
    //         }
    //     }
    //     return AppHelper.sortNumbersArrayAsc(mineList);
    // }

}
