import './app/ui-elements/custom-elements/@custom-elements.module';
import './index.scss';
import { App } from './app/App';
import { AppLoaderHandler } from './app/app-loader-handler';


import GameWizard from './app/game/game-wizard/game-wizard';


import OptionsSettingsFactory from './app/game/game-settings/options-settings/options-settings-factory';

//will change to transform
// -- router guard
// on reload return to your state

document.addEventListener('DOMContentLoaded', () => {
  // AppLoaderHandler.display();
  // new App();

  AppLoaderHandler.hide();

  // const test = document.getElementsByTagName("app-dropdown-select")[0];
  const gamesetup = document.getElementById("game-set-up");

  // const controller = OptionsSettingsFactory.getOptionsSettingsControllerForMode();
  // gamesetup.append(controller.render());
  // controller.init();

  const wiz = new GameWizard();
  gamesetup.append(wiz.render());
  wiz.init();


});
