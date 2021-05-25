import './app/ui-elements/custom-elements/@custom-elements.module';
import './index.scss';
import { App } from './app/App';
import { AppLoaderHandler } from './app/app-loader-handler';

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


  // }, 3000);

  const gamesetup = document.getElementById("main-content");
  // const gamesetup = document.getElementById("game-set-up");

  
  // const wizard = new GameWizardOriginal();

  // const wizard = new GameWizardVSBot();

  const localfriend = { id: 'localfriend', username: 'local friend' };
  const wizard = new GameWizardVSFriend(localfriend);
  
  // const FRIEND = { id: 'friend', username: 'Kate' };
  // const wizard = new GameWizardVSOnline(FRIEND);


  wizard.onCancel = () => {
    console.log('oncancel');
  };

  wizard.onComplete = (gameConfig) => {
    console.log('oncomplete');
    console.log(gameConfig);
  };

  gamesetup.append(wizard.render());
  wizard.init();

});
