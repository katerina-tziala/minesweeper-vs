'use strict';
import { STYLES_CONFIG, PALLETE } from './minefield-ui-config/minefield-ui.constants';
import * as GameColors from '../../game-utils/game-colors';
import * as TileUI from './tile-ui';
import * as TileChecker from '../tile/tile-checker';

export class MinefieldUI {
    #mineType;
    #pallete;
    #ctx;
    #width = 0;
    #height = 0;
    #minesPositions = [];

    constructor(theme = 'light', mineType = 'virusMine') {
        this.#mineType = mineType;
        this.#pallete = Object.assign({ ...PALLETE[theme] }, { ...GameColors.getThemePallete(theme) });
    }

    // set minesPositions(minesPositions) {
    //     this.#minesPositions = minesPositions;
    // }

    #calculateCanvasSize(value) {
        return (value * STYLES_CONFIG.tileSize) + (value + STYLES_CONFIG.canvasPadding);
    }

    #drawTileContent(tile, minesPositions = []) {
        const containsMine = TileChecker.containsMine(tile);
        if (containsMine) {
            const styles = { pallete: this.#pallete, iconType: this.#mineType };
            TileUI.drawMine(this.#ctx, tile, styles);
        } else {
            TileUI.drawEmptyTileContent(this.#ctx, tile, this.#pallete, minesPositions);
        }
    }

    #clearTileArea(tile) {
        const { xStart, yStart, xEnd } = { ...tile.area };
        const size = xEnd - xStart;
        this.#ctx.clearRect(xStart, yStart, size, size);
    }

    init(canvas, rows = 0, columns = 0) {
        if (canvas) {
            this.#ctx = canvas.getContext("2d");
            this.#width = this.#calculateCanvasSize(rows);
            this.#height = this.#calculateCanvasSize(columns);
            canvas.setAttribute('width', this.#width);
            canvas.setAttribute('height', this.#height);
        }
    }

    initCanvas(tiles = [], minesPositions = []) {
        if (!this.#ctx) {
            return;
        }
        this.#minesPositions = minesPositions;
        this.#ctx.clearRect(0, 0, this.#width, this.#height);
        tiles.forEach(tile => this.#drawUntouchedTile(tile));
    }

    #drawUntouchedTile(tile) {
        if (!this.#ctx || !tile) {
            return;
        }
        this.#clearTileArea(tile);
        TileUI.drawTile(this.#ctx, tile, this.#pallete.unrevealed);
        TileUI.drawTileShadow(this.#ctx, tile, this.#pallete.innerShadow);
    }

    drawRevealedTile(tile) {
        if (!this.#ctx || !tile) {
            return;
        }
        this.#clearTileArea(tile);
        TileUI.drawTile(this.#ctx, tile, this.#pallete.revealed);
        this.#drawTileContent(tile, this.#minesPositions);
    }

    drawMark(tile, colorKey = '1') {
        if (!this.#ctx || !tile) {
            return;
        }
        this.#clearTileArea(tile);
        TileUI.drawTile(this.#ctx, tile, this.#pallete.unrevealed);
        TileUI.drawTileShadow(this.#ctx, tile, this.#pallete.innerShadow);
        TileUI.drawMark(this.#ctx, tile, this.#pallete[colorKey]);
    }

    drawFlag(tile, colorKey = '1', flagType = 'awesomeFlag') {
        if (!this.#ctx || !tile) {
            return;
        }
        this.#clearTileArea(tile);
        TileUI.drawTile(this.#ctx, tile, this.#pallete.unrevealed);
        TileUI.drawTileShadow(this.#ctx, tile, this.#pallete.innerShadow);
        const styles = { color: this.#pallete[colorKey], iconType: flagType };
        TileUI.drawFlag(this.#ctx, tile, styles);
    }



    drawActiveTile(tile) {
        if (!this.#ctx || !tile) {
            return;
        }
        this.#clearTileArea(tile);
        TileUI.drawTile(this.#ctx, tile, this.#pallete.active);
        //   // if flag if mark show icon


    }


    drawTile(tile) {
        if (!this.#ctx || !tile) {
            return;
        }
        
        if (TileChecker.untouched(tile)) {
            this.#drawUntouchedTile(tile);
        } else {
             // if flag if mark show icon
            console.log('reset touched tile');
        }
        console.log('resetTileDisplay');
        console.log(this.#minesPositions);
  
    }










}
