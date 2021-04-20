"use strict";

import { WIZARD_NAME } from "GameWizardComponents";
export { WIZARD_NAME } from "GameWizardComponents";

export const DOM_ELEMENT_ID = {
  container: "game-wizard__navigation-container",
  timelineBar: "timeline-bar__",
};

export const DOM_ELEMENT_CLASS = {
  container: "game-wizard__navigation",
  containerExpanded: "game-wizard__navigation--expanded",
  stepsContainer: "game-wizard-navigation__steps",
  timelineBar: "game-wizard-navigation__timeline-bar",
  timelineBarCompleted: "completed",
};

export const NAVIGATION_STEPS = [
  WIZARD_NAME.vsModeSettings,
  WIZARD_NAME.levelSettings,
  WIZARD_NAME.turnSettings,
  WIZARD_NAME.optionsSettings
];
