'use strict';

export function setShadow(ctx, properties) {
  ctx.shadowColor = properties.color;
  ctx.shadowOffsetX = properties.shadowOffsetX || 0;
  ctx.shadowOffsetY = properties.shadowOffsetY || 0;
  ctx.shadowBlur = properties.shadowBlur || 0;
};

export function clearShadow(ctx) {
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowBlur = 0;
};

export function drawBackground(ctx, color) {
  ctx.fillStyle = color;
  ctx.fill();
};

export function drawRect(ctx, area, radius = 0) {
  const { xStart, xEnd, yStart, yEnd } = area;
  const { xStartRadius, xEndRadius, yStartRadius, yEndRadius } = getRectRadius(area, radius);
  ctx.beginPath();
  ctx.moveTo(xStartRadius, yStart);
  ctx.lineTo(xEndRadius, yStart);
  ctx.quadraticCurveTo(xEnd, yStart, xEnd, yStartRadius);
  ctx.lineTo(xEnd, yEndRadius);
  ctx.quadraticCurveTo(xEnd, yEnd, xEndRadius, yEnd);
  ctx.lineTo(xStartRadius, yEnd);
  ctx.quadraticCurveTo(xStart, yEnd, xStart, yEndRadius);
  ctx.lineTo(xStart, yStartRadius);
  ctx.quadraticCurveTo(xStart, yStart, xStartRadius, yStart);
  ctx.closePath();
};

function getRectRadius(area, radius) {
  const { xStart, xEnd, yStart, yEnd } = area;
  const xStartRadius = xStart + radius;
  const xEndRadius = xEnd - radius;

  const yStartRadius = yStart + radius;
  const yEndRadius = yEnd - radius;

  return { xStartRadius, xEndRadius, yStartRadius, yEndRadius };
}

export function drawRoundedLine(ctx, start, end) {
  ctx.beginPath();
  ctx.lineCap = "round";
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.closePath();
  ctx.stroke();
};


export function drawShape(ctx, points) {
  const [startingPoint, ...shapePoints] = points;
  ctx.beginPath();
  ctx.moveTo(startingPoint.x, startingPoint.y);
  for (let index = 0; index < shapePoints.length; index++) {
    const canvasPoint = shapePoints[index];
    ctx.lineTo(canvasPoint.x, canvasPoint.y);
  }
  ctx.lineTo(startingPoint.x, startingPoint.y);
  ctx.closePath();
};
