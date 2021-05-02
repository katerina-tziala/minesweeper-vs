import './ui-elements/custom-elements/@custom-elements.module';
import './index.scss';
import { App } from './app/App';
import { AppLoaderHandler } from './app/app-loader-handler';
document.addEventListener('DOMContentLoaded', () => {
  //AppLoaderHandler.display();
  new App();


  // -- router guard
  // on reload return to your state
  
  // AppLoaderHandler.hide();

  // const test = document.getElementsByTagName("app-dilemma-selection")[0];
  // console.log(test);
  // test.addEventListener('onChoiceSelected', (event) => {
  //   console.log('button click');
  //   console.log(event.detail.value);
  // })
  // setTimeout(() => {
  //   //test.removeAttribute('type');
  //   test.remove();
  // }, 4000)

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
