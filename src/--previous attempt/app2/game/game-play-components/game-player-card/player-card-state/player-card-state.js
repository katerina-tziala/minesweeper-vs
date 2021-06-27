"use strict";

import { TYPOGRAPHY } from "~/_constants/typography.constants";
import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { valueDefined } from "~/_utils/validator";
import { IconLoader } from "~/components/loaders/icon-loader/icon-loader";

import {
  DOM_ELEMENT_ID,
  DOM_ELEMENT_CLASS,
} from "./player-card-state.constants";

export class PlayerCardState {
  static getStateSectionID(player) {
    return DOM_ELEMENT_ID.stateSection + player.id;
  }

  static getAllowedFlagsID(player) {
    return DOM_ELEMENT_ID.allowedFlags + player.id;
  }

  static getStateSectionContent(player, flaggingAllowed = true) {
    if (player.entered) {

      return flaggingAllowed ? PlayerCardState.generateFlagState(player) : PlayerCardState.generateRevealState();
    }
    return PlayerCardState.generateLoadingState(player.colorType);
  }

  static generateStateSection(player, flaggingAllowed = true) {
    const stateSection = ElementGenerator.generateContainer([
      DOM_ELEMENT_CLASS.stateSection,
    ]);
    ElementHandler.setID(
      stateSection,
      PlayerCardState.getStateSectionID(player),
    );
    const content = PlayerCardState.getStateSectionContent(player, flaggingAllowed);
    stateSection.append(content);
    return stateSection;
  }

  static generateLoadingState(colorType) {
    const icon = IconLoader.generateIcon(colorType);
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.loadingState]);
    container.append(icon);
    return container;
  }

  static generateRevealState() {
    return ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.revealState]);
  }

  static generateFlagState(player) {
    const flagContainer = ElementGenerator.generateContainer([
      DOM_ELEMENT_CLASS.flagState,
    ]);
    flagContainer.append(PlayerCardState.generateAllowedFlags(player));
    return flagContainer;
  }

  static generateAllowedFlags(player) {
    const interfaceParams = PlayerCardState.getAllowedFlagsContentAndStyles(
      player.allowedFlags,
    );
    const allowedFlagsContainer = ElementGenerator.generateContainer(
      interfaceParams.styles,
    );
    ElementHandler.setID(
      allowedFlagsContainer,
      PlayerCardState.getAllowedFlagsID(player),
    );
    allowedFlagsContainer.innerHTML = interfaceParams.content;
    return allowedFlagsContainer;
  }

  static getAllowedFlagsContentAndStyles(allowedFlags) {
    const styles = [DOM_ELEMENT_CLASS.allowedFlags];
    let content = "";

    if (!valueDefined(allowedFlags)) {
      styles.push(DOM_ELEMENT_CLASS.allowedFlagsInfinite);
    } else {
      if (allowedFlags < 3) {
        styles.push(
          DOM_ELEMENT_CLASS.allowedFlags +
          TYPOGRAPHY.doubleHyphen +
          allowedFlags,
        );
      }
      content = allowedFlags.toString();
    }
    return { content, styles };
  }

  static getStateSection(player) {
    return ElementHandler.getByID(PlayerCardState.getStateSectionID(player));
  }

  static getAllowedFlagsContainer(player) {
    return ElementHandler.getByID(PlayerCardState.getAllowedFlagsID(player));
  }

  // UPDATES
  static updateStateSection(player, flaggingAllowed = true) {
    return PlayerCardState.getStateSection(player).then((stateSection) => {
      ElementHandler.clearContent(stateSection);
      const content = PlayerCardState.getStateSectionContent(player, flaggingAllowed);
      stateSection.append(content);
    });
  }

  static updateAllowedFlags(player) {
    return PlayerCardState.getAllowedFlagsContainer(player).then(
      (allowedFlagsContainer) => {
        const interfaceParams = PlayerCardState.getAllowedFlagsContentAndStyles(
          player.allowedFlags,
        );
        ElementHandler.clearContent(allowedFlagsContainer);
        ElementHandler.setStyleClass(
          allowedFlagsContainer,
          interfaceParams.styles,
        );
        allowedFlagsContainer.innerHTML = interfaceParams.content;
      },
    );
  }
}
