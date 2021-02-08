"use strict";

import { SettingsController } from "../settings-controller/settings-controller";
import { HeaderActionsController } from "./header-actions-controller";

export class JoinPageActionsController extends HeaderActionsController {
  #SettingsController;

  constructor() {
   super();
   this.settingsController = new SettingsController();
  }

  // get actions() {
  //   const fragment = document.createDocumentFragment();
  //   fragment.append(this.settingsController.generateView());
  //   return fragment;
  // }

}
