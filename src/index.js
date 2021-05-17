import './app/ui-elements/custom-elements/@custom-elements.module';
import './index.scss';
import { App } from './app/App';
import { AppLoaderHandler } from './app/app-loader-handler';


import { LevelSettings } from './app/game/game-settings/level-settings/level-settings';

import { TurnSettings } from './app/game/game-settings/turn-settings/turn-settings'

import { OptionsSettingsOriginal } from './app/game/game-settings/options-settings/options-settings-original/options-settings-original';
import { OptionsSettingsDetect } from './app/game/game-settings/options-settings/options-settings-detect/options-settings-detect';
import { OptionsSettingsParallel } from './app/game/game-settings/options-settings/options-settings-parallel/options-settings-parallel';

import { OptionsSettingsClear } from './app/game/game-settings/options-settings/options-settings-clear/options-settings-clear';

import OptionsSettingsFactory from './app/game/game-settings/options-settings/options-settings-factory';

//will change to transform

document.addEventListener('DOMContentLoaded', () => {
  //AppLoaderHandler.display();
  // new App();
  AppLoaderHandler.hide();


  // -- router guard
  // on reload return to your state


  // const test = document.getElementsByTagName("app-dropdown-select")[0];



  // test.setOptions(options);


  const gamesetup = document.getElementById("game-set-up");

  // const sss = new LevelSettings();

  // gamesetup.append(sss.render());


  // sss.init({
  //   columns: 5,
  //   level: "custom",
  //   numberOfMines: 7,
  //   rows: 12
  // });


  // const turnSettings = new TurnSettings();
  // gamesetup.append(turnSettings.render());

  // turnSettings.init({
  //   turnTimer: false,
  //   turnDuration: 3,
  //   missedTurnsLimit: 4,
  //   consecutiveTurns: false
  // });


  // OptionsSettingsOriginal
  // OptionsSettingsDetect
  // OptionsSettingsParallel
  // OptionsSettingsClear
  // const optionsSettings = new OptionsSettingsClear();
  // gamesetup.append(optionsSettings.render());

  // optionsSettings.init();
  // OptionsSettingsFactory.getOptionsSettingsControllerForMode()
  //   .then(Controller => {
  //     const controller = new Controller();
  //     gamesetup.append(controller.render());
  //     controller.init();
  //   });

  // const controller = OptionsSettingsFactory.getOptionsSettingsControllerForMode();
  // gamesetup.append(controller.render());
  // controller.init();
  // setTimeout(() => {
  //   console.log(sss.settings);
  // }, 3000)


  // test.addEventListener("onValueChange", (event) => {
  //   console.log(event.detail);
  //   // DropdownSelectNavigation.manageNavigation(
  //   //   event,
  //   //   listbox,
  //   //   this.onEscape.bind(this),
  //   //   this.onEnter.bind(this),
  //   // );
  // });

  // test.addEventListener('onExpandStateChange', (event) => {
  //   console.log('onExpandStateChange');
  //   console.log(event.detail);
  // })
  // setTimeout(() => {
  //   //test.setAttribute('min', 5);
  //   test.setAttribute('disabled', 'true');
  //   //test.remove();
  // }, 3000)


  // // test.init('kate');
  // // //   // // console.log(test);
  // // //   // test.setAttribute('name', 'username');

  //   // setTimeout(() => {
  //   //   test.setAttribute('min', 5);
  //   //   //test.setAttribute('type', 'friend');
  //   //  // test.remove();
  //   // }, 3000)
  //   setTimeout(() => {
  //     console.log('dis');
  //     test.setAttribute('disabled', true);

  //     //test.setAttribute('type', 'friend');
  //    // test.remove();
  //   }, 5000)
  //ws://localhost:9000?user=test
  // const test = document.getElementsByTagName("app-icon-button")[0];

  //  test.addEventListener('onValueChange', (event) => {
  //    console.log('onValueChange');
  //    console.log(event.detail);
  //  })
  // console.log(test);

  // const test = document.createElement("app-text-input");
  // console.log(test);
  // const main = document.getElementById("main-content");
  // main.append(test);
});
