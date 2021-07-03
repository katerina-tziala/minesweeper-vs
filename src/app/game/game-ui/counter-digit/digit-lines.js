'use strict';
import { CavnasUtils } from 'UTILS';
import { CONFIG } from './counter-digit.constants';

function drawDigitLine(ctx, points) {
    CavnasUtils.drawShape(ctx, points);
    ctx.lineCap = "round";
    ctx.fill();
}

function getCapPoints(x, y, step, direction = 1) {
    const ridge = y + step;
    const xIncrement = (direction * step);

    const points = [];
    points.push({ x: x + xIncrement, y });
    points.push({ x, y: ridge });
    return points;
}

function getStepChange() {
    return Math.ceil(CONFIG.lineChange / 2);
}


function getVerticalBottomCapPoints(x, y, direction = 1) {
    const { lineSize, lineThickness, lineChange } = CONFIG;
    const step = getStepChange();
    const maxY = y + lineSize;
    const minY = y + lineChange;
    const maxX = x + (direction * lineThickness);

    const capPoints = getCapPoints(maxX, maxY, -step, direction);

    let points = [];
    points.push({ x, y });
    points.push({ x: x, y: maxY - step });
    points = points.concat(capPoints);
    points.push({ x: maxX, y: minY });

    return points;
}

function getVerticalTopCapPoints(x, y, direction = 1) {
    const { lineSize, lineThickness, lineChange } = CONFIG;
    const step = getStepChange();
    const maxY = y + lineSize;
    const minY = y + step;
    const maxX = x + (direction * lineThickness);

    const points = getCapPoints(x, y, step, direction);
    points.push({ x, y: maxY });
    points.push({ x: maxX, y: maxY - lineChange });
    points.push({ x: maxX, y: minY });

    return points;
}

function getMiddleLinePoints(x, y) {
    const step = getStepChange();
    const yStart = y - step;
    const xRange = getHorizontalLineRange(x);
    const yRange = { start: y, end: y + step };
    const endingPoints = getHorizontalLineEndPoints(xRange, yRange);

    let points = [];
    points.push({ x, y });
    points.push({ x: xRange.start, y: yStart });
    points.push({ x: xRange.shortEnd, y: yStart });
    points = points.concat(endingPoints);
    return points;
}

function getHorizontalLineRange(x) {
    const { lineSize, lineChange } = CONFIG;
    const start = x + lineChange;
    const end = x + lineSize;
    const shortEnd = end - lineChange;
    return { start, end, shortEnd };
}

function getHorizontalLineEndPoints(xRange, yRange) {
    const points = [];
    points.push({ x: xRange.end, y: yRange.start });
    points.push({ x: xRange.shortEnd, y: yRange.end });
    points.push({ x: xRange.start, y: yRange.end });
    return points;
}

function getHorizontalLinePoints(x, y, direction = 1) {
    const { lineThickness } = CONFIG;
    const xRange = getHorizontalLineRange(x);
    const yRange = { start: y, end: y + (direction * lineThickness) };
    const points = getHorizontalLineEndPoints(xRange, yRange);
    points.unshift({ x, y });
    return points;
}




function getTopLineY() {
    return CONFIG.padding;
}

function getLeftLineX() {
    return CONFIG.padding;
}

function getMiddleLineX() {
    const { padding, middleLeftSpace } = CONFIG;
    return padding + middleLeftSpace;
}

function getBottomLineY() {
    const { padding, height, lineSize } = CONFIG;
    return height - (padding + lineSize);
}

function getRightLineX() {
    const { width, padding } = CONFIG;
    return width - padding;
}

export function drawTopLeftLine(ctx) {
    const x = getLeftLineX();
    const y = getTopLineY();
    const points = getVerticalBottomCapPoints(x, y, 1);
    drawDigitLine(ctx, points);
}

export function drawBottomLeftLine(ctx) {
    const x = getLeftLineX();
    const y = getBottomLineY();
    const points = getVerticalTopCapPoints(x, y, 1);
    drawDigitLine(ctx, points);
}

export function drawTopRightLine(ctx) {
    const x = getRightLineX();
    const y = getTopLineY();
    const points = getVerticalBottomCapPoints(x, y, -1);
    drawDigitLine(ctx, points);
}

export function drawBottomRightLine(ctx) {
    const x = getRightLineX();
    const y = getBottomLineY();
    const points = getVerticalTopCapPoints(x, y, -1);
    drawDigitLine(ctx, points);
}

/* MIDDLE LINES */

export function drawTopMiddleLine(ctx) {
    const x = getMiddleLineX();
    const y = getTopLineY();
    const points = getHorizontalLinePoints(x, y);
    drawDigitLine(ctx, points);
}

export function drawBottomMiddleLine(ctx) {
    const { height, padding } = CONFIG;
    const x = getMiddleLineX();
    const y = height - padding;
    const points = getHorizontalLinePoints(x, y, -1);
    drawDigitLine(ctx, points);
}

export function drawMiddleLine(ctx) {
    const { lineSize, padding, topSpace } = CONFIG;
    const x = getMiddleLineX();
    const y = padding + lineSize + topSpace;
    const points = getMiddleLinePoints(x, y);
    drawDigitLine(ctx, points);
}

export function getDrawHandler() {
    const drawHandler = new Map();
    drawHandler.set(1, drawTopLeftLine);
    drawHandler.set(2, drawTopMiddleLine);
    drawHandler.set(3, drawTopRightLine);
    drawHandler.set(4, drawBottomRightLine);
    drawHandler.set(5, drawBottomMiddleLine);
    drawHandler.set(6, drawBottomLeftLine);
    drawHandler.set(7, drawMiddleLine);
    return drawHandler;
}