import './app/ui-elements/custom-elements/@custom-elements.module';
import './index.scss';
import { App } from './app/App';
import { AppLoaderHandler } from './app/app-loader-handler';




//will change to transform

document.addEventListener('DOMContentLoaded', () => {
  //AppLoaderHandler.display();
  //new App();
  AppLoaderHandler.hide();


  // -- router guard
  // on reload return to your state


  const test = document.getElementsByTagName("app-dropdown-select")[0];

  const options = [
    {
      value: 'beginner',
      displayValue: '<span>beginner</span>',
      ariaLabel: 'beginner',
      selected: true
    },
    {
      value: 'intermediate',
      displayValue: '<span>intermediate</span>',
      ariaLabel: 'intermediate',
      selected: false
    },
    {
      value: 'expert',
      displayValue: '<span>expert</span>',
      ariaLabel: 'expert',
      selected: false
    },
    {
      value: 'custom',
      displayValue: '<span>custom</span>',
      ariaLabel: 'custom',
      selected: false
    }
  ];

  test.setOptions(options)

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
