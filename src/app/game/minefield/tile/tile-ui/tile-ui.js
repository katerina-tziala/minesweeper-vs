'use strict';
import * as TileChecker from '../tile-checker';
import { CavnasUtils, Color } from 'UTILS';
import { STYLES_CONFIG, SHADOWS, ICONS } from '../../minefield-ui/minefield-ui-config/minefield-ui.constants';
import * as TileShapes from './tile-shapes';

function getContentPosition(tileArea, padding) {
    const { xStart, yStart } = tileArea;
    const xPosition = xStart + padding.left;
    const yPosition = yStart + padding.top;
    return { xPosition, yPosition };
};

function drawIcon(ctx, tile, iconConfig) {
    const { xPosition, yPosition } = getContentPosition(tile.area, iconConfig.padding);
    const icon = String.fromCharCode(parseInt(iconConfig.code, 16));
    ctx.font = iconConfig.font;
    ctx.fillText(icon, xPosition, yPosition);
}


export function drawTile(ctx, tile, color) {
    drawTileShape(ctx, tile);
    CavnasUtils.drawBackground(ctx, color);
}

export function drawTileShape(ctx, tile) {
    CavnasUtils.drawRect(ctx, tile.area, STYLES_CONFIG.tileRadius);
}

export function drawTileShadow(ctx, tile, color) {
    const strokeColor = Color.adjustHexColorBrightness(color, SHADOWS.inner.shadowAdjustment);
    const shadowParams = { ...SHADOWS.inner, color };
    ctx.strokeStyle = strokeColor;
    CavnasUtils.setShadow(ctx, shadowParams);
    TileShapes.drawShadowLine(ctx, tile);
    CavnasUtils.clearShadow(ctx);
}

export function drawNonMineTileContent(ctx, tile, pallete, minesPositions = []) {
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
    const iconConfig = ICONS[styles.iconType];
    ctx.fillStyle = styles.pallete.mine;
    drawIcon(ctx, tile, iconConfig)
}

export function drawWrongFlagHint(ctx, tile, styles) {
    const { color, shadowColor } = styles;
    const shadowParams = { ...SHADOWS.wrongFlagHint };
    shadowParams.color = shadowColor;
    CavnasUtils.setShadow(ctx, shadowParams);
    ctx.fillStyle = color;
    TileShapes.drawWrongFlagHint(ctx, tile.area);
    CavnasUtils.clearShadow(ctx);
}

export function drawFlag(ctx, tile, styles) {
    const { iconType, color } = styles;
    const iconConfig = ICONS[iconType];
    ctx.fillStyle = color;
    drawIcon(ctx, tile, iconConfig)
}

export function drawMark(ctx, tile, color) {
    const iconConfig = ICONS.mark;
    ctx.fillStyle = color;
    drawIcon(ctx, tile, iconConfig);
}

export function drawDetectedMineTarget(ctx, tile, styles) {
    const { shadowColor, color, opponentColor } = styles;

    let shadowParams = { ...SHADOWS.detectedMineTarget.left };
    shadowParams.color = shadowColor;
    CavnasUtils.setShadow(ctx, shadowParams);
    ctx.strokeStyle = color;
    TileShapes.drawLeftSideOfTarget(ctx, tile.area);

    shadowParams = Object.assign(shadowParams, {...SHADOWS.detectedMineTarget.right});
    CavnasUtils.setShadow(ctx, shadowParams);
    ctx.strokeStyle = opponentColor;
    TileShapes.drawRightSideOfTarget(ctx, tile.area);

    CavnasUtils.clearShadow(ctx);
}
