'use strict';

export class AppLoaderHandler {

  static get #appLoader() {
    return document.getElementById('main-loader');
  }

  static hide() {
    const loader = this.#appLoader;
    if (loader) {
      loader.hide();
    }
  }
  
  static display() {
    const loader = this.#appLoader;
    if (loader) {
      loader.display();
    }
  }
}
