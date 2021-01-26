"use strict";

export const COLORS = {
  light: {
    "1": "#0039e6",
    "2": "#009900",
    "3": "#ff0000",
    "4": "#ff6600",
    "5": "#b3b300",
    "6": "#9900cc",
    "7": "#ff00bf",
    "8": "#1a1a1a",
  },
  dark: {
    "1": "#00ffff",
    "2": "#00ff00",
    "3": "#ff0000",
    "4": "#ff8300",
    "5": "#ffff00",
    "6": "#b84dff",
    "7": "#ff00bf",
    "8": "#ffffff",
  }
};

export const SHADOW_COLORS = {
  light: "rgba(0,0,0, 0.5)",
  dark: "rgba(0, 255, 255, 0.5)"
};

export const CONFIG = {
  minSize: 10,
  maxSize: 20,
  tiltStep: 12,
  lineWeight: 3,
  angleIncrementWeight: 0.05,
  pointerIncrement: 4,
  shadowColor: 0,
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  shadowBlur: 3
};