'use strict';
import { CONFIG } from './shapes-config';

export function drawWrongFlagHint(ctx, area) {
    const { xStart, yStart } = area;
    const { width, padding, opacity } = CONFIG.wrongFlagHint;

    const startingPointX = xStart + padding;
    const startingPointY = yStart + padding;
    
    ctx.globalAlpha = opacity;
    ctx.beginPath();
    ctx.moveTo(startingPointX, yStart);
    ctx.lineTo(startingPointX + width, yStart);
    ctx.lineTo(xStart, startingPointY + width);
    ctx.lineTo(xStart, startingPointY);
    ctx.lineTo(startingPointX, yStart);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;
}

export function drawShadowLine(ctx, tile) {
    const { xStart, xEnd, yStart, yEnd } = tile.area;
    const space = CONFIG.shadowLinePadding;

    ctx.beginPath();
    ctx.moveTo(xEnd - space, yStart + space);
    ctx.lineTo(xEnd - space, yEnd - space);
    ctx.lineTo(xStart + space, yEnd - space);
    ctx.lineCap = 'round';
    ctx.stroke();
};