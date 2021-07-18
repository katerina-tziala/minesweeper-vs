'use strict';
import { roundTo, CavnasUtils } from 'UTILS';
import { CONFIG, PALETTE } from './player-turns.constants';

function getStartAngle(direction = 1) {
    return 90 * direction;
}

export function getStyles(theme) {
    const { shadowColor, ...palette } = PALETTE[theme] || PALETTE.light;
    const { strokeWidth, shadow } = CONFIG;

    const styles = { ...palette, strokeWidth };
    const shadowStyles = { ...shadow };
    shadowStyles.color = shadowColor;
    styles.shadow = shadowStyles;
    return styles;
}

export function getBaseCircleParams() {
    const { size, indicatorSize, strokeWidth, shadow } = CONFIG;
    const middle = size / 2;
    const radius = middle - indicatorSize - strokeWidth - shadow.blur;
    return { cx: middle, cy: middle, radius };
}

export function getRotationAngle(numberOfTurns = 0, fullCircle = false) {
    let rotationAngle = 0;
    if (numberOfTurns) {
        rotationAngle = fullCircle ? (360 / numberOfTurns) : 180 / (numberOfTurns - 1);
    }
    return rotationAngle;
}

export function generateTurnsIndicators(params, numberOfTurns = 0, rotationAngle = 0, direction = 1) {
    const startAngle = getStartAngle(direction);
    const { cx, cy, radius } = params;

    let points = [];
    for (let index = 0; index < numberOfTurns; index++) {
        const angle = startAngle + (rotationAngle * index);
        const degrees = angle * direction * (Math.PI / 180);

        const x = roundTo(cx + (radius * Math.cos(degrees)));
        const y = roundTo(cy + (radius * Math.sin(degrees)));

        const position = numberOfTurns - index;
        points.push({ position, x, y, angle, degrees });
    }
    points = points.sort((a, b) => a.position - b.position);
    return points;
}

export function drawTurnsIndicator(ctx, point) {
    const { x, y, color } = point;
    ctx.fillStyle = color;
    CavnasUtils.drawCircle(ctx, x, y, CONFIG.indicatorSize);
    ctx.stroke();
    ctx.fill();
}
