"use strict";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS } from "./game-message-controller.constants";

export class GameMessageController {

  constructor() {

    console.log("GameMessageController");

  }

  generateView() {
    return ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.container], DOM_ELEMENT_ID.container);
  }







  
}
