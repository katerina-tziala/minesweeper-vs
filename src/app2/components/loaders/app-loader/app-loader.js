"use strict";

import { ElementHandler } from "HTML_DOM_Manager";
import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS } from "./app-loader.constants";

export class AppLoader {
  static get loader() {
    return ElementHandler.getByID(DOM_ELEMENT_ID.loader);
  }

  static get spinner() {
    return ElementHandler.getByID(DOM_ELEMENT_ID.spinner);
  }

  static display() {
    AppLoader.startSpinner();
    AppLoader.displayLoader();
  }

  static hide() {
    AppLoader.hideLoader();
    AppLoader.stopSpinner();
  }

  static hideLoader() {
    AppLoader.loader.then((loader) => ElementHandler.hide(loader));
  }

  static displayLoader() {
    AppLoader.loader.then((loader) => ElementHandler.display(loader));
  }

  static stopSpinner() {
    AppLoader.spinner.then((spinner) =>
      ElementHandler.removeStyleClass(spinner, DOM_ELEMENT_CLASS.spin),
    );
  }

  static startSpinner() {
    AppLoader.spinner.then((spinner) =>
      ElementHandler.addStyleClass(spinner, DOM_ELEMENT_CLASS.spin),
    );
  }
}
