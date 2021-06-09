'use strict';

export function clearShadow(ctx) {
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowBlur = 0;
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