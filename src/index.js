import './app/ui-elements/custom-elements/@custom-elements.module';
import './index.scss';
import { App } from './app/App';
import { AppLoaderHandler } from './app/app-loader-handler';

import  './app/test/test';

//will change to transform

document.addEventListener('DOMContentLoaded', () => {
  //AppLoaderHandler.display();
   //new App();
  AppLoaderHandler.hide();


  // -- router guard
  // on reload return to your state

  
  // const test = document.getElementsByTagName("app-text-input")[0];
  // // test.init('kate');
  // // //   // // console.log(test);
  // // //   // test.setAttribute('name', 'username');
  // test.addEventListener('onValueChange', (event) => {
  //   console.log('value');
  //   console.log(event.detail);
  // })
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
