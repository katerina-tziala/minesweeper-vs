'use strict';

const appLoader = () => {
  return document.getElementById('main-loader');
}

export function hide() {
  const loader = appLoader();
    if (loader) {
      loader.hide();
    }
}

export function display() {
  const loader = appLoader();
  if (loader) {
    loader.display();
  }
}
