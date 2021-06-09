'use strict';
import { ATTRIBUTES, TEMPLATE, DOM_ELEMENT_CLASS } from '../minefield.constants';
import { CONFIG, COLOR_THEME, MINE_ICON } from './tile.constants';
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
        const { xPosition, yPosition } = getContentPosition(tileArea);
        const color = GameColors.getThemeColor(theme, content);

        ctx.fillStyle = Color.adjustHexColorBrightness(color, CONFIG.contenColorAdjustment);
        ctx.strokeStyle = color;
        ctx.font = CONFIG.textFont;
        ctx.lineWidth = 1;

        ctx.fillText(content, xPosition, yPosition);
        ctx.strokeText(content, xPosition, yPosition);
    }
}

export function drawMine(ctx, tileArea, theme, mineType) {
    const { xPosition, yPosition } = getContentPosition(tileArea);
    const iconConfig = MINE_ICON[mineType] || MINE_ICON.bomb;
    const icon = String.fromCharCode(parseInt(iconConfig.code, 16));
    const pallete = getThemePallete(theme);

    ctx.fillStyle = pallete.mine;
    ctx.font = CONFIG.iconFont;
    ctx.fillText(icon, xPosition + iconConfig.adjustLeft, yPosition + iconConfig.adjustTop);
}

function getContentPosition(tileArea) {
    const { xStart, yStart } = tileArea;
    const xPosition = xStart + CONFIG.contentLeftPadding;
    const yPosition = yStart + CONFIG.contentTopPadding;
    return { xPosition, yPosition };
};

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