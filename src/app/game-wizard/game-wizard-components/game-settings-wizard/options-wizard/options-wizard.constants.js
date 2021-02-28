"use strict";
import { GAME_OPTIONS_CONTENT } from "~/_constants/content.constants";
import { VS_SETTINGS_PROPERTIES } from "~/game/_models/options-settings/options-setting.constants";
export { FIELDS_BASED_ON_STRATEGY, ALLOW_SNEAK_PEEK_SETTINGS } from "~/game/_models/options-settings/options-setting.constants";

export const SETTINGS_PROPERTIES = {
  ...VS_SETTINGS_PROPERTIES,
  default: ["marks", "wrongFlagHint"]
};

export const FIELD_NAME = {
  tileFlagging: "tileFlagging",
  openStrategy: "openStrategy",
  openCompetition: "openCompetition"
};

export const CONTENT = {
  title: "game options",
  labels: GAME_OPTIONS_CONTENT
};
