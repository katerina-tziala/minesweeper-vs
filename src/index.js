import './app/ui-elements/custom-elements/@custom-elements.module';
import './index.scss';
import { App } from './app/App';
import * as PageLoaderHandler from './app/pages/page-loader-handler';
import { LocalStorageHelper } from 'UTILS';


//will change to transform
// -- router guard
// on reload return to your state
import { PubSub, PubSubState } from 'UTILS';


document.addEventListener('DOMContentLoaded', () => {
  // AppLoaderHandler.display();
  new App();


  
  // PageLoaderHandler.hide();

  // const test = document.getElementsByTagName("app-wizard-stepper")[0];
  // test.setSteps(steps);

  //console.log(test);
  // setTimeout(() => {
  //   const newSteps = steps.slice(0, 3);
  //   // console.log(newSteps);

  //   test.setSteps(newSteps);
  //   //test.selectNext();


  // }, 3000);

  // const main = document.getElementById("main-content");
  // console.log(main.getBoundingClientRect());
  // const gameSetUp = LocalStorageHelper.getGameSetUp('original');
  // console.log(gameSetUp);


});
 // window.onhashchange = this.locationHashChanged.bind(this);
  // locationHashChanged(event) {
  //   console.log(event);
  //   if (location.hash === '#cool-feature') {
  //     console.log("You're visiting a cool feature!");
  //   }
  // }