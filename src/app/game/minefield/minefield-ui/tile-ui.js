'use strict';
import * as TileChecker from '../tile/tile-checker';
import { CavnasUtils, Color } from 'UTILS';
import { STYLES_CONFIG, MINE_ICON } from './minefield-ui.constants';

function drawShadowLine(ctx, tile) {
    const { xStart, xEnd, yStart, yEnd } = tile.area;
    ctx.beginPath();
    ctx.moveTo(xEnd, yStart);
    ctx.lineTo(xEnd, yEnd);
    ctx.lineTo(xStart, yEnd);
    ctx.lineCap = 'round';
    ctx.stroke();
};

function getContentPosition(tileArea, padding) {
    const { xStart, yStart } = tileArea;
    const xPosition = xStart + padding.left;
    const yPosition = yStart + padding.top;
    return { xPosition, yPosition };
};

function getResizedTileArea(area, topLeftValue, bottomRightValue) {
    const { xStart, yStart, xEnd, yEnd } = area;
    return {
        xStart: xStart + topLeftValue,
        yStart: yStart + topLeftValue,
        xEnd: xEnd + bottomRightValue,
        yEnd: yEnd + bottomRightValue
    };
}

function drawTargetLines(ctx, detonatedMineArea) {
    const targetOuter = getResizedTileArea({ ...detonatedMineArea }, -1, 1);
    const targetInner = getResizedTileArea({ ...detonatedMineArea }, STYLES_CONFIG.detonatedMinePadding, -STYLES_CONFIG.detonatedMinePadding);

    const topLeftStart = { x: targetOuter.xStart, y: targetOuter.yStart };
    const topLeftEnd = { x: targetInner.xStart, y: targetInner.yStart };
    CavnasUtils.drawRoundedLine(ctx, topLeftStart, topLeftEnd);
    ctx.stroke();

    const topRightStart = { x: targetOuter.xEnd, y: targetOuter.yStart };
    const topRightEnd = { x: targetInner.xEnd, y: targetInner.yStart };
    CavnasUtils.drawRoundedLine(ctx, topRightStart, topRightEnd);
    ctx.stroke();

    const bottomLeftStart = { x: targetOuter.xStart, y: targetOuter.yEnd };
    const bottomLeftEnd = { x: targetInner.xStart, y: targetInner.yEnd };
    CavnasUtils.drawRoundedLine(ctx, bottomLeftStart, bottomLeftEnd);
    ctx.stroke();

    const bottomRightStart = { x: targetOuter.xEnd, y: targetOuter.yEnd };
    const bottomRightEnd = { x: targetInner.xEnd, y: targetInner.yEnd };
    CavnasUtils.drawRoundedLine(ctx, bottomRightStart, bottomRightEnd);
    ctx.stroke();
}


export function drawTileShape(ctx, tile) {
    CavnasUtils.drawRect(ctx, tile.area, STYLES_CONFIG.tileRadius);
}

export function drawTileShadow(ctx, tile, color) {
    const strokeColor = Color.adjustHexColorBrightness(color, STYLES_CONFIG.innerShadow.shadowAdjustment);
    const shadowParams = { ...STYLES_CONFIG.innerShadow, color };
    ctx.strokeStyle = strokeColor;
    CavnasUtils.setShadow(ctx, shadowParams);
    drawShadowLine(ctx, tile);
    CavnasUtils.clearShadow(ctx);
}

export function drawEmptyTileContent(ctx, tile, pallete, minesPositions = []) {
    const minesAround = TileChecker.getNumberOfMinesAround(tile.neighbors, minesPositions);
    const content = minesAround ? minesAround.toString() : undefined;
    if (content) {
        const color = pallete[content];
        const styles = STYLES_CONFIG.content;
        const { xPosition, yPosition } = getContentPosition(tile.area, styles.padding);
        ctx.fillStyle = Color.adjustHexColorBrightness(color, styles.colorAdjustment);
        ctx.strokeStyle = color;
        ctx.font = styles.font;
        ctx.lineWidth = 1;
        ctx.fillText(content, xPosition, yPosition);
        ctx.strokeText(content, xPosition, yPosition);
    }
}

export function drawMine(ctx, tile, styles) {
    const iconConfig = MINE_ICON[styles.mineType] || MINE_ICON.bomb;
    const { xPosition, yPosition } = getContentPosition(tile.area, iconConfig.padding);
    const icon = String.fromCharCode(parseInt(iconConfig.code, 16));

    // const pallete = getThemePallete(theme);
    // // ctx.shadowColor = '#fff';
    // // ctx.shadowOffsetX = 0;
    // // ctx.shadowOffsetY = 0;
    // // ctx.shadowBlur = 6;

    ctx.fillStyle = styles.pallete.mine;
    ctx.font = iconConfig.font;
    ctx.fillText(icon, xPosition, yPosition);
    //CavnasUtils.clearShadow(ctx);

    //if (tile.modifiedBy) {
        drawDetonatedMineIndicator(ctx, tile, styles);
    //}
}

export function drawDetonatedMineIndicator(ctx, tile, styles) {
    const detonatedMineArea = getResizedTileArea({ ...tile.area }, STYLES_CONFIG.detonatedMinePadding, -STYLES_CONFIG.detonatedMinePadding);
    const strokeStyle = styles.pallete.detonatedMine;
    const shadowParams = { ...STYLES_CONFIG.detonatedMineShadow };
    shadowParams.color = strokeStyle;

    CavnasUtils.setShadow(ctx, shadowParams);
    ctx.strokeStyle = strokeStyle;
    CavnasUtils.drawRect(ctx, detonatedMineArea, 1);
    ctx.stroke();

    drawTargetLines(ctx, { ...detonatedMineArea })

    CavnasUtils.drawRect(ctx, detonatedMineArea, 1);
    ctx.stroke();
    CavnasUtils.clearShadow(ctx);
}

