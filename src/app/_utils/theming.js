"use strict";

import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS } from "~/_constants/ui.constants";
import { AppSettingsModel } from "~/_models/app-settings";
import { ElementHandler } from "HTML_DOM_Manager";

export const setAppTheme = () => {
  const settings = new AppSettingsModel();
  const appStyles = `${DOM_ELEMENT_CLASS.app} ${DOM_ELEMENT_CLASS.theme}${settings.theme}`;
  return ElementHandler.getByID(DOM_ELEMENT_ID.app).then(appContainer => {
    appContainer.className = appStyles;
    return;
  });
};
