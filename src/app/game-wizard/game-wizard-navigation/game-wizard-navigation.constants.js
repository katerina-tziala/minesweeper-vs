"use strict";

import { WIZARD_NAME } from "GameSettingsWizard";

export const DOM_ELEMENT_ID = {
  container: "game-wizard__navigation-container",
};

export const DOM_ELEMENT_CLASS = {
  container: "game-wizard__navigation",
  containerExpanded: "game-wizard__navigation--expanded",
  stepsContainer: "game-wizard-navigation__steps",
};

export const NAVIGATION_STEPS = [
  WIZARD_NAME.vsModeSettings,
  WIZARD_NAME.levelSettings,
  WIZARD_NAME.turnSettings,
  WIZARD_NAME.optionsSettings
];
