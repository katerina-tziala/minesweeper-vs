import './app/ui-elements/custom-elements/@custom-elements.module';
import './index.scss';
import { App } from './app/App';
import { AppLoaderHandler } from './app/app-loader-handler';



document.addEventListener('DOMContentLoaded', () => {
  //AppLoaderHandler.display();
  new App();


  // -- router guard
  // on reload return to your state

  //AppLoaderHandler.hide();

  // const test = document.getElementsByTagName("app-username-form")[0];
  // test.init('kate');
  // //   // // console.log(test);
  // //   // test.setAttribute('name', 'username');
  // // test.addEventListener('onSubmit', (event) => {
  // //   console.log('button click');
  // //   console.log(event.detail);
  // // })
  //   setTimeout(() => {
  //     //test.setAttribute('disabled', true);
  //     //test.setAttribute('type', 'friend');
  //     test.remove();
  //   }, 3000)

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
