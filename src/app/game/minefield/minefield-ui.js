'use strict';
import { ATTRIBUTES, TEMPLATE, DOM_ELEMENT_CLASS } from './minefield.constants';
import { CONFIG } from './tile/tile.constants';
import * as TileChecker from './tile/tile-checker';
import * as GameColors from '../game-utils/game-colors';
import * as TileUI from './tile/tile-ui';
import { CavnasUtils, Color } from 'UTILS';
import { TileState } from './tile/tile-state.enum';

export function setCanvasHeight(canvas, rows = 0, columns = 0) {
    if (canvas) {
        const width = (rows * CONFIG.tileSize) + (rows + 1);
        const height = (columns * CONFIG.tileSize) + (columns + 1);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
    }
}

export function drawTile(ctx, tile, theme = 'light') {
    if (!ctx) {
        return;
    }
    TileUI.drawTileShape(ctx, tile);
    TileUI.drawTileBackground(ctx, tile, theme);
    TileUI.drawTileShadow(ctx, tile, theme);
}

export function drawRevealedTile(ctx, tile, minesPositions, mineType = 'bomb', theme = 'light') {
    if (!ctx) {
        return;
    }
    TileUI.drawTileShape(ctx, tile);
    TileUI.drawTileBackground(ctx, tile, theme);
    const containsMine = TileChecker.containsMine(tile);
    if (containsMine) {
        TileUI.drawMine(ctx, tile.area, theme, mineType);
    } else {
        drawTileContent(ctx, tile, theme, minesPositions);
    }
}

function drawTileContent(ctx, tile, theme = 'light', minesPositions = []) {
    const minesAround = TileChecker.getNumberOfMinesAround(tile.neighbors, minesPositions);
    const content = minesAround ? minesAround.toString() : undefined;
    TileUI.drawTileContent(ctx, tile.area, content, theme)
}