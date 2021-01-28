"use strict";
import { ElementGenerator } from "HTML_DOM_Manager";
import { DOM_ELEMENT_CLASS } from "./user-avatar.constants";

export class UserAvatar {

  static generate(colorType, isBot = false) {
    const styles = [DOM_ELEMENT_CLASS.avatar];
    if (isBot) {
      styles.push(DOM_ELEMENT_CLASS.botAvatar);
    }
    if (colorType) {
      styles.push(DOM_ELEMENT_CLASS.colorType + colorType);
    }
    return ElementGenerator.generateContainer(styles);
  }

}
