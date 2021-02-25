"use strict";
import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import {
  timeoutPromise
} from "~/_utils/utils";
import { DOM_ELEMENT_CLASS, CLOSE_BTN } from "./game-wizard-view.constants";


export class GameWizardView {

  static generateTitle(titleText) {
    return ElementGenerator.generateSecondLevelHeader(titleText);
  }

  static generateHeader(title, action) {
    const header = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.header]);
    const headerTitle = GameWizardView.generateTitle(title);
    const closeBnt = ElementGenerator.generateButton(CLOSE_BTN, action);
    header.append(headerTitle, closeBnt);
    return header;
  }

  static generateWizardBox() {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.box], DOM_ELEMENT_CLASS.box);
    return container;
  }

  static generateWizardContent(content) {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.container], DOM_ELEMENT_CLASS.container);
    container.append(content);
    return container;
  }

  static generateMainSection(content) {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.mainContent], DOM_ELEMENT_CLASS.mainContent);
    container.append(content);
    return container;
  }

  static generateWizard(content) {
    const box = GameWizardView.generateWizardBox();
    const contentContainer = GameWizardView.generateWizardContent(content);
    box.append(contentContainer);
    return Promise.resolve(box);
  }

  static get box() {
    return ElementHandler.getByID(DOM_ELEMENT_CLASS.box);
  }

  static get container() {
    return ElementHandler.getByID(DOM_ELEMENT_CLASS.container);
  }

  static get mainSection() {
    return ElementHandler.getByID(DOM_ELEMENT_CLASS.mainContent);
  }

  static updateMainSection(content) {
    return GameWizardView.mainSection.then(mainSection => {
      ElementHandler.clearContent(mainSection);
      mainSection.append(content);
      return;
    });
  }

  static get mainHeight() {
    return GameWizardView.mainSection.then(container => {
      const containerProperties = container.getBoundingClientRect();
      return containerProperties.height;
    });
  }

  static get containerHeight() {
    return GameWizardView.container.then(container => {
      const containerProperties = container.getBoundingClientRect();
      return containerProperties.height;
    });
  }

  static get boxAndContentHeight() {
    return Promise.all([
      GameWizardView.box,
      GameWizardView.containerHeight
    ]);
  }

  static expandWizard() {
    return GameWizardView.boxAndContentHeight.then(([box, height]) => {
      box.style.height = `${height}px`;
      return;
    });
  }

  static resetWizardHeight(height = 0) {
    return GameWizardView.box.then(box => {
      box.style.height = `${height}px`;
      return timeoutPromise();
    });
  }

  static updateMainView(content) {
    return GameWizardView.resetWizardHeight(156)
      .then(() => {
        return GameWizardView.updateMainSection(content);
      })
      .then(() => {
        GameWizardView.expandWizard();
        return;
      });
  }

  static updateView(content) {
    return GameWizardView.resetWizardHeight()
      .then(() => {
        return this.container;
      })
      .then(container => {
        ElementHandler.clearContent(container);
        container.append(content);
      }).then(() => {
        GameWizardView.expandWizard();
        return;
      });
  }
}
