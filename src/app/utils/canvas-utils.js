'use strict';

export function setShadow(ctx, shadowProperties) {
  ctx.shadowColor = shadowProperties.color;
  ctx.shadowOffsetX = shadowProperties.shadowOffsetX;
  ctx.shadowOffsetY = shadowProperties.shadowOffsetY;
  ctx.shadowBlur = shadowProperties.shadowBlur;
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
  ctx.closePath();
};
