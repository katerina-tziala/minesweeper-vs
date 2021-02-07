"use strict";

import { 
  clone,
  replaceStringParameter
} from "~/_utils/utils";

import {
  ElementHandler,
  ElementGenerator,
  AriaHandler,
} from "HTML_DOM_Manager";

import {
  DOM_ELEMENT_ID,
  DOM_ELEMENT_CLASS,
  BUTTON
} from "./toggle.constants";

export class Toggle {
  #animationDuration = 500;
  #expanded = false;
  #hasContent = false;
  #name;
  #transitionTimeout;
  #documentListeners = {};

  constructor(name, expanded = false, animationDuration = 500) {
    this.#name = name;
    this.#animationDuration = animationDuration;
    this.#expanded = expanded;
  }

  get #containerId() {
    return DOM_ELEMENT_ID.container + this.#name;
  }

  get #buttonId() {
    return DOM_ELEMENT_ID.toggleButton + this.#name;
  }

  get #panelId() {
    return DOM_ELEMENT_ID.togglePanel + this.#name;
  }

  get #contentId() {
    return DOM_ELEMENT_ID.toggleContent + this.#name;
  }

  get toggleButton() {
    return ElementHandler.getByID(this.#buttonId);
  }

  get contentContainer() {
    return ElementHandler.getByID(this.#contentId);
  }

  get #panel() {
    return ElementHandler.getByID(this.#panelId);
  }

  get #toggleButtonParams() {
    const params = clone(BUTTON);
    params.className = params.className + this.#name;
    params.attributes["aria-label"] = replaceStringParameter(params.attributes["aria-label"], this.#name);
    return params;
  }

  #generatePanel(content) {
    const panel = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.togglePanel], this.#panelId);
    this.#setPanelHeight(panel);
    this.#setPanelOverflow(panel);
    const contentContainer = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.toggleContent], this.#contentId);
    if (content) {
      contentContainer.append(content);
    }
    panel.append(contentContainer);
    return panel;
  }

  get #generatedButton() {
    const button = ElementGenerator.generateButton(this.#toggleButtonParams, this.#onToggleButtonChange.bind(this));
    ElementHandler.setID(button, this.#buttonId);
    ElementHandler.setDisabled(button, !this.#hasContent);
    return button;
  }

  generateView(content) {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.container], this.#containerId);
    this.#hasContent = content ? true : false;
    container.append(this.#generatedButton, this.#generatePanel(content));
    return container;
  }


  #onToggleButtonChange() {
    this.#expanded = !this.#expanded;
    console.log("onToggleButtonChange");
    console.log(this.#name);

    
    this.togglePanel();
  }

  #setToggleButtonState() {
    return this.toggleButton.then((button) => {
      ElementHandler.removeStyleClass(button, DOM_ELEMENT_CLASS.toggleButtonExpanded);
      AriaHandler.setAriaExpanded(button, this.#expanded);
      if (this.#expanded) {
        ElementHandler.addStyleClass(button, DOM_ELEMENT_CLASS.toggleButtonExpanded);
      }
      return;
    });
  }

  togglePanel() {
    this.#expanded ? this.#expandPanel() : this.#collapsePanel();
  }

  #expandPanel() {
    clearTimeout(this.#transitionTimeout);
    this.#setToggleButtonState();
    return Promise.all([
      this.#panel,
      this.contentContainer
    ]).then(([panel, contentContainer]) => {
      const contentHeight = contentContainer.getBoundingClientRect().height;
      this.#setPanelHeight(panel, contentHeight);
      this.#transitionTimeout = setTimeout(() => {
        this.#setPanelOverflow(panel);
        this.#detectOutsideClick();
      }, this.#animationDuration);
    });
  }

  #collapsePanel() {
    clearTimeout(this.#transitionTimeout);
    this.#expanded = false;
    this.#setToggleButtonState();
    this.#removeOutsideClick();
    this.#panel.then(panel => {
      this.#setPanelHeight(panel);
      this.#setPanelOverflow(panel);
    });
  }

  #setPanelHeight(panel, height = 0) {
    panel.style.height = `${height}px`;
  }

  #setPanelOverflow(panel) {
    panel.style.overflow = this.#expanded ? "visible" : "hidden";
  }

  #detectOutsideClick() {
    this.#documentListeners[this.#name] = this.#collapseOnOutsideClick.bind(this);
    document.addEventListener("click", this.#documentListeners[this.#name]);
  }

  #removeOutsideClick() {
    document.removeEventListener("click", this.#documentListeners[this.#name]);
    this.#documentListeners = {};
  }

  #collapseOnOutsideClick(event) {
    const settingsPanel = event.target.closest(`#${this.#panelId}`);
    if (!settingsPanel && this.#expanded) {
      this.#collapsePanel();
    }
  }

}
