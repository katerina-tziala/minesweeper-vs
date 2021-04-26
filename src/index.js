import './ui-elements/custom-elements/@custom-elements.module';
import './index.scss';

import { AppLoaderHandler } from './app/app-loader-handler';
import { App } from './app/App';

document.addEventListener('DOMContentLoaded', () => {
  AppLoaderHandler.display();
  new App();
  // AppLoaderHandler.hide();
  // const test = document.getElementsByTagName("app-icon-button")[0];
  //  test.addEventListener('click', (event) => {
  //    console.log('icon button click');
  //    //console.log(event);
  //  })
  //  test.addEventListener('onValueChange', (event) => {
  //    console.log('onValueChange');
  //    console.log(event.detail);
  //  })
  // console.log(test);
  // setTimeout(() => {
  //   test.removeAttribute('error-message');
  // }, 4000)
  // const test = document.createElement("app-text-input");
  // console.log(test);
  // const main = document.getElementById("main-content");
  // main.append(test);
});
