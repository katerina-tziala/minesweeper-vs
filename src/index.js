import './app/ui-elements/custom-elements/@custom-elements.module';
import './index.scss';
import { App } from './app/App';
import { AppLoaderHandler } from './app/app-loader-handler';



// import OptionsSettingsFactory from './app/game/game-settings/options-settings/options-settings-factory';

import { GameWizardOriginal, GameWizardVSBot, GameWizardVSFriend, GameWizardVSOnline } from 'GAME_WIZARD';

//will change to transform
// -- router guard
// on reload return to your state

document.addEventListener('DOMContentLoaded', () => {
  // AppLoaderHandler.display();
  // new App();

  AppLoaderHandler.hide();
  // const test = document.getElementsByTagName("app-wizard-stepper")[0];
  // test.setSteps(steps);

  //console.log(test);
  // setTimeout(() => {
  //   const newSteps = steps.slice(0, 3);
  //   // console.log(newSteps);

  //   test.setSteps(newSteps);
  //   //test.selectNext();


  // }, 3000)

  // setTimeout(() => {
  //   const newSteps = steps.slice(0, 3);
  //   // console.log(newSteps);

  //  // test.setSteps(newSteps);
  //   test.selectPrevious();


  // }, 3000)

  const gamesetup = document.getElementById("main-content");
  // const gamesetup = document.getElementById("game-set-up");

  // const controller = OptionsSettingsFactory.getOptionsSettingsControllerForMode();
  // gamesetup.append(controller.render());
  // controller.init();

  // const wiz = new GameWizardVS();
  // gamesetup.append(wiz.render());
  // wiz.init();

  // const wiz = new GameWizardVSFriend();
  // gamesetup.append(wiz.render());
  // // wiz.init();

  // const wizard = new GameWizardOriginal();
  const localfriend = { id: 'localfriend', username: 'local friend' };
  // const wizard = new GameWizardVSFriend(localfriend);
  // const wizard = new GameWizardVSBot();

  const FRIEND = { id: 'friend', username: 'Kate' };

  const wizard = new GameWizardVSOnline(FRIEND);
  gamesetup.append(wizard.render());
  wizard.init();

  // const aser = new GameWizardVSOnline();
  // gamesetup.append(aser.render());

});
