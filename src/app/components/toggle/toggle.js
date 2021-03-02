"use strict";
import { ElementGenerator } from "HTML_DOM_Manager";
import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS } from "./toggle.constants";
import { ToggleButton } from "./toggle-button/toggle-button";
import { ToggleContent } from "./toggle-content/toggle-content";
import { TogglePanel } from "./toggle-panel/toggle-panel";

export class Toggle {
  #outsideClickDetection = false;
  #overflowAllowed = true;
  #name;
  #documentListeners = {};

  constructor(name, expanded = false, detectOutsideClick = false, overflowAllowed = true) {
    this.#name = name;
    this.expanded = expanded;
    this.#outsideClickDetection = detectOutsideClick;
    this.#overflowAllowed = overflowAllowed;
    this.#setControllers();
  }

  #setControllers() {
    this.button = new ToggleButton(this.#name, this.expanded);
    this.button.onStateChange = this.#onToggleButtonChange.bind(this);
    this.content = new ToggleContent(this.#name);
    this.panel = new TogglePanel(this.#name, this.#overflowContent);
    this.panel.onAnimationEnd = this.#onPanelAnimationEnd.bind(this);
  }

  get #id() {
    return DOM_ELEMENT_ID.container + this.#name;
  }

  get documentElement() {
    return ElementHandler.getByID(this.#id);
  }

  get contentHeight() {
    return this.content ? this.content.elementHeight : 0;
  }

  get #overflowContent() {
    return this.expanded && this.#overflowAllowed;
  }

  #generatePanel(content) {
    const panel = this.panel.generateView();
    const contentContainer = this.content.generateView(content);
    panel.append(contentContainer);
    return panel;
  }

  generateView(content) {
    const container = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.container], this.#id);
    const button = this.button.generateView();
    const panel = this.#generatePanel(content);
    container.append(button, panel);
    return container;
  }

  #onToggleButtonChange() {
    this.expanded = !this.expanded;
    this.expanded ? this.#expand() : this.#collapse();
    if (this.onStateChange) {
      this.onStateChange(this.expanded);
    }
  }

  updatePanelHeight(height) {
    return this.panel.updateHeight(height);
  }

  #onPanelAnimationEnd() {
    if (this.expanded) {
      this.#onExpanded();
    }
    if (this.onAnimationEnd) {
      this.onAnimationEnd();
    }
  }

  #onExpanded() {
    this.panel.updateOverlflow(this.#overflowContent);
    this.#detectOutsideClick();
  }

  #expand() {
    this.button.updateToggleState(this.expanded);
    return this.contentHeight.then(contentHeight => {
      return this.updatePanelHeight(contentHeight);
    });
  }

  #collapse() {
    this.expanded = false;
    this.#removeOutsideClick();
    this.button.updateToggleState(this.expanded);
    this.panel.updateHeight(0);
  }

  #detectOutsideClick() {
    if (this.#outsideClickDetection && !this.#documentListeners[this.#name]) {
      this.#documentListeners[this.#name] = this.#collapseOnOutsideClick.bind(this);
      document.addEventListener("click", this.#documentListeners[this.#name]);
    }
  }

  #removeOutsideClick() {
    if (this.#documentListeners[this.#name]) {
      document.removeEventListener("click", this.#documentListeners[this.#name]);
      this.#documentListeners = {};
    }
  }

  #collapseOnOutsideClick(event) {
    if (this.expanded && this.panel && !this.panel.clickedInside(event)) {
      this.#collapse();
    }
  }

}
