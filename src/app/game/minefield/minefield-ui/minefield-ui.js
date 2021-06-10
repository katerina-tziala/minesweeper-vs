'use strict';

import { STYLES_CONFIG, PALLETE } from './minefield-ui.constants';
import { CavnasUtils, Color } from 'UTILS';
import * as GameColors from '../../game-utils/game-colors';
import * as TileUI from './tile-ui';
import { TileState } from '../tile/tile-state.enum';


import * as TileChecker from '../tile/tile-checker';
export class MinefieldUI {
    #theme;
    #pallete;
    #ctx;
    #mineType = 'virus';

    constructor() {
        this.#theme = 'light';
        this.#pallete = Object.assign({ ...PALLETE[this.#theme] }, { ...GameColors.getThemePallete(this.#theme) });

        console.log('MinefieldUI');
    }

    #calculateCanvasSize(value) {
        return (value * STYLES_CONFIG.tileSize) + (value + STYLES_CONFIG.canvasPadding);
    }

    init(canvas, rows = 0, columns = 0) {
        if (canvas) {
            this.#ctx = canvas.getContext("2d");
            console.log(this.#ctx);
            const width = this.#calculateCanvasSize(rows);
            const height = this.#calculateCanvasSize(columns);
            canvas.setAttribute('width', width);
            canvas.setAttribute('height', height);
        }
    }

    initCanvas(tiles = []) {
        if (!this.#ctx) {
            return;
        }
        tiles.forEach(tile => {
            TileUI.drawTileShape(this.#ctx, tile);
            CavnasUtils.drawBackground(this.#ctx, this.#pallete.unrevealed);
            TileUI.drawTileShadow(this.#ctx, tile, this.#pallete.innerShadow);
        });
    }

    drawRevealedTile(tile, minesPositions) {
        if (!this.#ctx || !tile) {
            return;
        }
        TileUI.drawTileShape(this.#ctx, tile);
        CavnasUtils.drawBackground(this.#ctx, this.#pallete.revealed);
        this.#drawTileContent(tile, minesPositions);
    }

    #drawTileContent(tile, minesPositions = []) {
        const containsMine = TileChecker.containsMine(tile);
        if (containsMine) {
            const styles = {
                pallete: this.#pallete,
                mineType: this.#mineType,
            };
            TileUI.drawMine(this.#ctx, tile, styles);
        } else {
            TileUI.drawEmptyTileContent(this.#ctx, tile, this.#pallete, minesPositions);
        }
    }


 
    



}

