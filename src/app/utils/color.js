'use strict';

function validRGBValue(value) {
  if (value > 255) {
    return 255;
  }
  return value < 0 ? 0 : value
}

function getColorR(colorNumber, adjustmentAmount) {
  const colorR = (colorNumber >> 16) + adjustmentAmount;
  return validRGBValue(colorR);
}

function getColorG(colorNumber, adjustmentAmount) {
  const colorG = (colorNumber & 0x0000FF) + adjustmentAmount;
  return validRGBValue(colorG);
}

function getColorB(colorNumber, adjustmentAmount) {
  const colorB = ((colorNumber >> 8) & 0x00FF) + adjustmentAmount;
  return validRGBValue(colorB);
}

export function adjustHexColorBrightness(colorCode, adjustmentAmount) {
  const colorNumber = parseInt(colorCode.slice(1), 16);

  const colorR = getColorR(colorNumber, adjustmentAmount);
  const colorB = getColorB(colorNumber, adjustmentAmount);
  const colorG = getColorG(colorNumber, adjustmentAmount);

  const color = (colorG | (colorB << 8) | (colorR << 16));

  return `#${color.toString(16)}`;
}
