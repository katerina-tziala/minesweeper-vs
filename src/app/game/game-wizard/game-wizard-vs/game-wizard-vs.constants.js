export const DOM_ELEMENT_CLASS = {
  container: 'game-wizard-content-vs',
  settingsContainer: 'game-wizard-vs__settings-container'
};

export const STEPS = {
  bot: 'bot',
  mode: 'mode',
  level: 'level',
  turns: 'turns',
  options: 'options'
};

export const GAME_MODE_STEPS = {
  clear: ['level', 'turns', 'options'],
  detect: ['level', 'turns', 'options'],
  parallel: ['level', 'options'],
};

export const STEPS_ARIA = {
  bot: 'bot settings',
  mode: 'game mode settings',
  level: 'level settings',
  turns: 'turns settings',
  options: 'options settings'
};