"use strict";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS } from "./confetti.constants";

import "../../../styles/components/confetti/confetti.scss";
export class Confetti {
  #_gameId;

  constructor() {
    console.log("Confetti");
  }
  //document.body.innerHTML

  generateView() {
    const canvas = document.createElement('canvas');
    ElementHandler.setID(canvas, "confetti-canvas")
    document.body.appendChild(canvas);
  }


}
