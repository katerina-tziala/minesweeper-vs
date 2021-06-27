'use strict';

const appLoader = () => {
  return document.getElementById('main-loader');
}

module.exports = {

  hide() {
    const loader = appLoader();
    if (loader) {
      loader.hide();
    }
  },

  display() {
    const loader = appLoader();
    if (loader) {
      loader.display();
    }
  }
};