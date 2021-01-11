"use strict";

import { WIZARD_NAME } from "GameSettingsWizard";

export const DOM_ELEMENT_ID = {
  container: "game-wizard-navigation-container",
};

export const DOM_ELEMENT_CLASS = {
  container: "game-wizard-navigation",
  containerExpanded: "game-wizard-navigation--expanded",
  containerExpandedFast: "game-wizard-navigation--expanded-fast",
  stepsContainer: "game-wizard-navigation__steps-container",
};

export const NAVIGATION_STEPS = [
  WIZARD_NAME.vsModeSettings,
  WIZARD_NAME.levelSettings,
  WIZARD_NAME.turnSettings,
  WIZARD_NAME.optionsSettings
];
