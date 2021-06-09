'use strict';
import { ATTRIBUTES, TEMPLATE, DOM_ELEMENT_CLASS } from '../minefield.constants';
import { CONFIG, COLOR_THEME, } from './tile.constants';
import * as TileChecker from './tile-checker';
import * as GameColors from '../../game-utils/game-colors';
import { CavnasUtils, Color } from 'UTILS';

export function drawTileShape(ctx, tile, radius = CONFIG.tileRadius) {
    CavnasUtils.drawRect(ctx, tile.area, radius);
}

export function drawTileBackground(ctx, tile, theme) {
    const pallete = getThemePallete(theme);
    const color = TileChecker.revealed(tile) ? pallete.revealed : pallete.unrevealed;
    ctx.fillStyle = color;
    ctx.fill();
}

export function drawTileShadow(ctx, tile, theme) {
    const pallete = getThemePallete(theme);
    ctx.strokeStyle = pallete.revealed;
    setShadowStyle(ctx, pallete.innerShadow)
    drawShadowLine(ctx, tile);
    CavnasUtils.clearShadow(ctx);
}

export function drawTileContent(ctx, tileArea, content, theme) {
    if (content) {
        const { xStart, yStart } = tileArea;
        const xPosition = xStart + CONFIG.contentLeftPadding;
        const yPosition = yStart + CONFIG.contentTopPadding;
        const color = GameColors.getThemeColor(theme, content);

        ctx.fillStyle = Color.adjustHexColorBrightness(color, CONFIG.contenColorAdjustment);
        ctx.strokeStyle = color;
        ctx.font = CONFIG.contentFont;
        ctx.lineWidth = 1;

        ctx.fillText(content, xPosition, yPosition);
        ctx.strokeText(content, xPosition, yPosition);
    }
}




function getThemePallete(theme = 'light') {
    return COLOR_THEME[theme];
};

function setShadowStyle(ctx, color) {
    ctx.shadowColor = color;
    ctx.shadowOffsetX = CONFIG.shadowOffset;
    ctx.shadowOffsetY = CONFIG.shadowOffset;
    ctx.shadowBlur = CONFIG.shadowBlur;
};

function drawShadowLine(ctx, tile) {
    const { xStart, xEnd, yStart, yEnd } = tile.area;
    ctx.beginPath();
    ctx.moveTo(xEnd, yStart);
    ctx.lineTo(xEnd, yEnd);
    ctx.lineTo(xStart + CONFIG.shadowOffset, yEnd);
    ctx.lineCap = 'round';
    ctx.stroke();
};