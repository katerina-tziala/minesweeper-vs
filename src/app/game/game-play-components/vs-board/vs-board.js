"use strict";

import { ElementGenerator } from "HTML_DOM_Manager";
import { DOM_ELEMENT_CLASS } from "./vs-board.constants";

export class VSBoard {
 
  static generateView(vColorType, sColorType) {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.vsBoard]);
    container.append(VSBoard.generateVSIndicator(vColorType, sColorType));
    return container;
  }

  static generateVSIndicator(vColorType, sColorType) {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.vsIndicator]);
    const vItem = VSBoard.generateIndicatorItem("v", vColorType);
    const sItem = VSBoard.generateIndicatorItem("s", sColorType);
    container.append(vItem, sItem);
    return container;
  }

  static generateIndicatorItem(text, colorType) {
    const styles = VSBoard.getIndicatorStyles(colorType);
    const container = ElementGenerator.generateContainer(styles);
    container.innerHTML = `<span class="${DOM_ELEMENT_CLASS.vsIndicatorItemContent}">${text}</span>`;
    return container;
  }

  static getIndicatorStyles(colorType) {
    const styles = [DOM_ELEMENT_CLASS.vsIndicatorItem];
   if (colorType) {
    styles.push(VSBoard.getIndicatorColorTypeStyle(colorType));
   }
    return styles;
  }

  static getIndicatorColorTypeStyle(colorType) {
    return DOM_ELEMENT_CLASS.vsIndicatorColor + colorType;
  }

}
