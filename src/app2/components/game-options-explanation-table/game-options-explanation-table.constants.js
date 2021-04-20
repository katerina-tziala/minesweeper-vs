"use strict";

import { VSMODE_CONTENT } from "~/_constants/content.constants";
import { GAME_OPTIONS_CONTENT } from "~/_constants/content.constants";

export const DOM_ELEMENT_CLASS = {
  vsMode: "game-option-explanation-vs-mode",
  level: "game-option-explanation-level",
  table: "game-option-explanation-table"
};

export const CONTENT = {
  ...VSMODE_CONTENT,
  ...GAME_OPTIONS_CONTENT,
  vsMode: "game goal",
  level: "level",
  turnDuration: "turn duration",
  missedTurnsLimit: "allowed missed turns",
  allowedFlags: "allowed flags",
  checked: "<span class='game-option-explanation--checked'></span>",
  unChecked: "<span class='game-option-explanation--unchecked'></span>",
  strategyKey: "tileFlagging"
};
