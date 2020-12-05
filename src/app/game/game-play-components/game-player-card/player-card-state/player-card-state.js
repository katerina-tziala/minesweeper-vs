"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";

import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS } from "./player-card-state.constants";

export class PlayerCardState {

  static getStateSectionID(player) {
    return DOM_ELEMENT_ID.stateSection + player.id;
  }

  static getAllowedFlagsID(player) {
    return DOM_ELEMENT_ID.allowedFlags + player.id;
  }

  static generateStateSection(player) {
    const stateSection = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.stateSection]);
    ElementHandler.setID(stateSection, PlayerCardState.getStateSectionID(player));
    const content = player.entered ? PlayerCardState.generateFlagState(player) : PlayerCardState.generateLoadingState();
    stateSection.append(content);
    return stateSection;
  }

  static generateLoadingState() {
    return ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.loadingState]);
  }

  static generateFlagState(player) {
    const flagContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.flagState]);
    flagContainer.append(PlayerCardState.generateAllowedFlags(player));
    return flagContainer;
  }

  static generateAllowedFlags(player) {
    const interfaceParams = PlayerCardState.getAllowedFlagsContentAndStyles(player.allowedFlags);
    const allowedFlagsContainer = ElementGenerator.generateContainer(interfaceParams.styles);
    ElementHandler.setID(allowedFlagsContainer, PlayerCardState.getAllowedFlagsID(player));
    allowedFlagsContainer.innerHTML = interfaceParams.content;
    return allowedFlagsContainer;
  }

  static getAllowedFlagsContentAndStyles(allowedFlags) {
    const styles = [DOM_ELEMENT_CLASS.allowedFlags];
    let content = "";

    if (allowedFlags === null || allowedFlags === undefined) {
      styles.push(DOM_ELEMENT_CLASS.allowedFlagsInfinite);
    } else {
      if (allowedFlags < 3) {
        styles.push(DOM_ELEMENT_CLASS.allowedFlags + TYPOGRAPHY.doubleHyphen + allowedFlags);
      }
      content = allowedFlags.toString();
    }
    return { content, styles };
  }

}
