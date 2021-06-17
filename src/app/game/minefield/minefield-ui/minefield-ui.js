'use strict';
import { STYLES_CONFIG, PALLETE } from './minefield-ui-config/minefield-ui.constants';
import * as GameColors from '../../game-utils/game-colors';
import * as TileUI from './tile-ui';
import * as TileChecker from '../tile/tile-checker';
import { TileState } from '../tile/tile-state.enum';

export class MinefieldUI {
    #mineType;
    #pallete;
    #ctx;
    #width = 0;
    #height = 0;
    #minesPositions = [];
    #stateDisplay = new Map();
    #stateContentDisplay = new Map();

    constructor(theme = 'light', mineType = 'bombMine') {
        this.#mineType = mineType;
        this.pallete = theme;
        this.#stateDisplay.set(TileState.Flagged, this.drawFlaggedTile.bind(this));
        this.#stateDisplay.set(TileState.Marked, this.drawMarkedTile.bind(this));
        this.#stateDisplay.set(TileState.Revealed, this.drawRevealedTile.bind(this));

        this.#stateContentDisplay.set(TileState.Flagged, this.#drawFlag.bind(this));
        this.#stateContentDisplay.set(TileState.Marked, this.#drawMark.bind(this));
        this.#stateContentDisplay.set(TileState.Revealed, this.#drawTileContent.bind(this));
    }

    set pallete(theme) {
        this.#pallete = Object.assign({ ...PALLETE[theme] }, { ...GameColors.getThemePallete(theme) });
    }

    init(canvas, rows = 0, columns = 0) {
        if (canvas) {
            this.#ctx = canvas.getContext('2d');
            this.#width = this.#calculateCanvasSize(rows);
            this.#height = this.#calculateCanvasSize(columns);
            canvas.setAttribute('width', this.#width);
            canvas.setAttribute('height', this.#height);
        }
    }

    initMinefield(tiles = [], minesPositions = []) {
        if (!this.#ctx) {
            return;
        }
        this.#minesPositions = minesPositions;
        this.#ctx.clearRect(0, 0, this.#width, this.#height);
        tiles.forEach(tile => this.drawUntouchedTile(tile));
    }

    drawTile(tile) {
        const { state } = tile;
        if (this.#stateDisplay.has(state)) {
            this.#stateDisplay.get(state)(tile);
        } else {
            this.drawUntouchedTile(tile);
        }
    }

    drawUntouchedTile(tile) {
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
        this.#drawTileContent(tile);
    }
    drawFlaggedTile(tile) {
        if (!this.#ctx || !tile) {
            return;
        }
        this.drawUntouchedTile(tile);
        const { colorType, flagType } = tile.styles;
        this.#drawFlag(tile, colorType, flagType);
    }

    drawActiveTile(tile) {
        if (!this.#ctx || !tile) {
            return;
        }
        this.#clearTileArea(tile);
        TileUI.drawTile(this.#ctx, tile, this.#pallete.active);
        const { state } = tile;
        if (this.#stateContentDisplay.has(state)) {
            const { colorType, flagType } = tile.styles;
            this.#stateContentDisplay.get(state)(tile, colorType, flagType);
        }
    }

    drawMarkedTile(tile) {
        if (!this.#ctx || !tile) {
            return;
        }
        this.drawUntouchedTile(tile);
        const { colorType } = tile.styles;
        this.#drawMark(tile, colorType);
    }

    #calculateCanvasSize(value) {
        return (value * STYLES_CONFIG.tileSize) + (value + STYLES_CONFIG.canvasPadding);
    }

    #clearTileArea(tile) {
        const { xStart, yStart, xEnd } = { ...tile.area };
        const size = xEnd - xStart;
        this.#ctx.clearRect(xStart, yStart, size, size);
    }

    #drawTileContent(tile) {
        const containsMine = TileChecker.containsMine(tile);
        if (containsMine) {
            const styles = { pallete: this.#pallete, iconType: this.#mineType };
            TileUI.drawMine(this.#ctx, tile, styles);
        } else {
            TileUI.drawEmptyTileContent(this.#ctx, tile, this.#pallete, this.#minesPositions);
        }
    }

    #drawFlag(tile, colorType = '1', flagType = 'awesomeFlag') {
        const styles = { color: this.#pallete[colorType], iconType: flagType };
        TileUI.drawFlag(this.#ctx, tile, styles);
    }

    #drawMark(tile, colorType = '1') {
        TileUI.drawMark(this.#ctx, tile, this.#pallete[colorType]);
    }

}
