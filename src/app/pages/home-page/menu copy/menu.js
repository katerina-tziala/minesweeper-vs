'use strict';
// import { GroupController } from '~/_utils/group-controller';
// import { MenuItem } from './menu-item/menu-item';

export class Menu {
  #MenuOptions;
  #onSelect;

  constructor() {
    // this.#onSelect = onSelect;
    // this.#setMenuOptions(options);
  }


  generate() {
    console.log("generate menu");
  }

  // #setMenuOptions(options) {
  //   this.#MenuOptions = new GroupController();
  //   options.forEach(option => {
  //     this.#MenuOptions.controllers = new MenuItem(option.name, this.#onSelectedOption.bind(this), option.disabled);
  //   });
  // }

  // generateView() {
  //   const menu = document.createElement('menu');
  //   this.#MenuOptions.controllers.forEach(option => menu.append(option.generateView()));
  //   return menu;
  // }

  // #onSelectedOption(option) {
  //   if (this.#onSelect) {
  //     this.#onSelect(option);
  //   }
  // }

  // toggleOptionState(option, state) {
  //   return this.#MenuOptions.getController(option).toggleState(state);
  // }

}
