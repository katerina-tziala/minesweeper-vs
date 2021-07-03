'use strict';
import { CavnasUtils } from 'UTILS';
import { CONFIG } from './shapes-config';
import { getTileCenter } from '../tile-utils';

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

export function drawLeftSideOfTarget(ctx, area) {
    const center = getTileCenter(area);
    const params = Object.assign(CONFIG.detectedMineTarget.left, center);
    
    ctx.lineWidth = CONFIG.targetLine.width;
    drawSemiCircle(ctx, params);
    ctx.stroke();

    const topStartX = area.xStart + CONFIG.targetLine.padding;
    const topStartY = area.yStart + CONFIG.targetLine.padding;
    drawTargetLineToRightBottom(ctx, topStartX, topStartY);

    const bottomStartAdjustment = CONFIG.targetLine.padding + CONFIG.targetLine.size
    const bottomStartX = topStartX + CONFIG.targetLine.size;
    const bottomStartY = area.yEnd - bottomStartAdjustment;
    drawTargetLineToLeftBottom(ctx, bottomStartX, bottomStartY);


    const topStartXRight = area.xEnd - CONFIG.targetLine.padding;
    const topStartYRight = area.yStart + CONFIG.targetLine.padding;
    drawTargetLineToLeftBottom(ctx, topStartXRight, topStartYRight);

    ctx.lineWidth = 1;
};

export function drawRightSideOfTarget(ctx, area) {
    const center = getTileCenter(area);
    const params = Object.assign(CONFIG.detectedMineTarget.right, center);
    ctx.lineWidth = CONFIG.targetLine.width;

    drawSemiCircle(ctx, params);
    ctx.stroke();

    const topStartX = area.xEnd - CONFIG.targetLine.padding;
    const topStartY = area.yStart + CONFIG.targetLine.padding;
    drawTargetLineToLeftBottom(ctx, topStartX, topStartY);

    const bottomStartAdjustment = CONFIG.targetLine.padding + CONFIG.targetLine.size;
    const bottomStartX = area.xEnd - bottomStartAdjustment;
    const bottomStartY = area.yEnd - bottomStartAdjustment;
    drawTargetLineToRightBottom(ctx, bottomStartX, bottomStartY);

    ctx.lineWidth = 1;
};

function drawSemiCircle(ctx, params) {
    const { x, y, radius, sAngle, eAngle } = params;
    ctx.beginPath();
    ctx.arc(x, y, radius, sAngle, eAngle);
};

function drawTargetLineToRightBottom(ctx, x, y) {
    const start = { x, y };
    const end = { x: x + CONFIG.targetLine.size, y: y + CONFIG.targetLine.size };
    CavnasUtils.drawRoundedLine(ctx, start, end);
};

function drawTargetLineToLeftBottom(ctx, x, y) {
    const end = { x, y };
    const start = { x: x - CONFIG.targetLine.size, y: y + CONFIG.targetLine.size };
    CavnasUtils.drawRoundedLine(ctx, start, end);
};
