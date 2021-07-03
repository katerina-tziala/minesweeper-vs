'use strict';
import { STYLES_CONFIG, PALETTE } from './minefield-ui-config/minefield-ui.constants';
import * as GameColors from '../../../game-utils/game-colors';
import { TileUI, TileState, TileChecker } from '../tile/@tile.module';

export class MinefieldUI {
    #mineType;
    #palette;
    #ctx;
    #width = 0;
    #height = 0;
    #minesPositions = [];
    #stateDisplay = new Map();
    #stateContentDisplay = new Map();

    constructor(theme = 'light', mineType = 'bombMine') {
        this.#mineType = mineType;
        this.palette = theme;
        this.#stateDisplay.set(TileState.Flagged, this.drawFlaggedTile.bind(this));
        this.#stateDisplay.set(TileState.Marked, this.drawMarkedTile.bind(this));
        this.#stateDisplay.set(TileState.Revealed, this.drawRevealedTile.bind(this));

        this.#stateContentDisplay.set(TileState.Flagged, this.#drawFlag.bind(this));
        this.#stateContentDisplay.set(TileState.Marked, this.#drawMark.bind(this));
        this.#stateContentDisplay.set(TileState.Revealed, this.#drawTileContent.bind(this));
    }

    set palette(theme) {
        this.#palette = Object.assign({ ...PALETTE[theme] }, { ...GameColors.getThemePalette(theme) });
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

    drawRevealedTiles(tiles = []) {
        if (!this.#ctx || !tiles.length) {
            return;
        }

        for (let index = 0; index < tiles.length; index++) {
            const tile = tiles[index];
            this.drawRevealedTile(tile);
        }
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
        TileUI.drawTile(this.#ctx, tile, this.#palette.unrevealed);
        TileUI.drawTileShadow(this.#ctx, tile, this.#palette.innerShadow);
    }

    drawRevealedTile(tile) {
        if (!this.#ctx || !tile) {
            return;
        }
        this.#clearTileArea(tile);
        TileUI.drawTile(this.#ctx, tile, this.#palette.revealed);
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
        TileUI.drawTile(this.#ctx, tile, this.#palette.active);
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
            this.#drawRevealedMine(tile);
        } else {
            TileUI.drawNonMineTileContent(this.#ctx, tile, this.#palette, this.#minesPositions);
        }
    }

    #drawMine(tile) {
        const styles = { palette: this.#palette, iconType: this.#mineType };
        TileUI.drawMine(this.#ctx, tile, styles);
    }

    #drawRevealedMine(tile) {
        if (TileChecker.detonateddMine(tile)) {
            this.#ctx.globalAlpha = 0.7;
            TileUI.drawTile(this.#ctx, tile, this.#palette.detonatedMine);
            this.#ctx.globalAlpha = 1;
        }
        this.#drawMine(tile);
        if (TileChecker.detectedMine(tile)) {
            this.#drawDetectedMineIndicator(tile);
        }
    }

    #drawDetectedMineIndicator(tile) {
        const { colorType, secondaryColorType } = tile.styles;
        const color = this.#getColor(colorType);
        const secondaryColor = secondaryColorType ? this.#getColor(secondaryColorType) : color;
        const palette = { color, secondaryColor };
        palette.shadowColor = this.#palette.targetShadow;
        TileUI.drawDetectedMineTarget(this.#ctx, tile, palette);
    }

    #drawFlag(tile, colorType, flagType = 'awesomeFlag') {
        const styles = { color: this.#getColor(colorType), iconType: flagType };
        TileUI.drawFlag(this.#ctx, tile, styles);

        if (tile.wrongFlagHint && !TileChecker.detectedMine(tile)) {
            TileUI.drawWrongFlagHint(this.#ctx, tile, this.#palette.wrongFlagHint);
        }
    }

    #drawMark(tile, colorType) {
        TileUI.drawMark(this.#ctx, tile, this.#getColor(colorType));
    }

    #getColor(colorType = '1') {
        return this.#palette[colorType];
    }

}
