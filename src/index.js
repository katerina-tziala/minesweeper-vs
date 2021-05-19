import './app/ui-elements/custom-elements/@custom-elements.module';
import './index.scss';
import { App } from './app/App';
import { AppLoaderHandler } from './app/app-loader-handler';


// import GameWizard from './app/game/game-wizard/game-wizard';


import OptionsSettingsFactory from './app/game/game-settings/options-settings/options-settings-factory';


import { GameWizardOriginal } from './app/game/game-wizard/game-wizard-original/game-wizard-original';

import { GameWizardVS } from './app/game/game-wizard/game-wizard-vs/game-wizard-vs';

import { BotSettings } from './app/game/game-settings/mode-settings/bot-settings/bot-settings'
import { GameModeSettings } from './app/game/game-settings/mode-settings/game-mode-settings/game-mode-settings'


//will change to transform
// -- router guard
// on reload return to your state

document.addEventListener('DOMContentLoaded', () => {
  // AppLoaderHandler.display();
  // new App();

  AppLoaderHandler.hide();

  // const test = document.getElementsByTagName("app-dropdown-select")[0];
  //const gamesetup = document.getElementById("main-content");
  const gamesetup = document.getElementById("game-set-up");
  
  // const controller = OptionsSettingsFactory.getOptionsSettingsControllerForMode();
  // gamesetup.append(controller.render());
  // controller.init();

  const wiz = new BotSettings();
  gamesetup.append(wiz.render());
  wiz.init();
  const asd = new GameModeSettings();
  gamesetup.append(asd.render());
  asd.init();



});
