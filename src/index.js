import './app/ui-elements/custom-elements/@custom-elements.module';
import './index.scss';
import { App } from './app/App';
import { AppLoaderHandler } from './app/app-loader-handler';


// import GameWizard from './app/game/game-wizard/game-wizard';


// import OptionsSettingsFactory from './app/game/game-settings/options-settings/options-settings-factory';


// import { GameWizardOriginal } from './app/game/game-wizard/game-wizard-original/game-wizard-original';


// import { BotSettings } from './app/game/game-settings/mode-settings/bot-settings/bot-settings'
// import { GameModeSettings } from './app/game/game-settings/mode-settings/game-mode-settings/game-mode-settings'

// import { GameWizardVS } from './app/game/game-wizard/game-wizard-vs/game-wizard-vs';
 import { GameWizardVSBot } from './app/game/game-wizard/game-wizard-vs/game-wizard-vs-bot/game-wizard-vs-bot';
// import { GameWizardVSFriend } from './app/game/game-wizard/game-wizard-vs/game-wizard-vs-friend/game-wizard-vs-friend';
// import { GameWizardVSOnline } from './app/game/game-wizard/game-wizard-vs/game-wizard-vs-online/game-wizard-vs-online';

//will change to transform
// -- router guard
// on reload return to your state

document.addEventListener('DOMContentLoaded', () => {
  // AppLoaderHandler.display();
  // new App();

  AppLoaderHandler.hide();

  // const steps = [
  //   {
  //     selected: false,
  //     name: 'bot',
  //     visited: false,
  //     disabled: false,
  //     ariaLabel: 'bot settings',
  //   },
  //   {
  //     selected: false,
  //     name: 'mode',
  //     visited: false,
  //     disabled: false,
  //     ariaLabel: 'game goal settings',
  //   },
  //   {
  //     selected: false,
  //     name: 'level',
  //     visited: false,
  //     disabled: false,
  //     ariaLabel: 'level settings',
  //   },
  //   {
  //     selected: false,
  //     name: 'turns',
  //     visited: false,
  //     disabled: false,
  //     ariaLabel: 'turns settings',
  //   },
  //   {
  //     selected: false,
  //     name: 'options',
  //     visited: false,
  //     disabled: false,
  //     ariaLabel: 'options settings',
  //   }
  // ];



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

  const asd = new GameWizardVSBot();
  gamesetup.append(asd.render());
  asd.init();

  // const aser = new GameWizardVSOnline();
  // gamesetup.append(aser.render());

});
