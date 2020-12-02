"use strict";

import { ElementHandler, ElementGenerator, AriaHandler } from "HTML_DOM_Manager";

import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, DROPDOWN_BNT } from "./dropdown-select-button.constants";

import { preventInteraction } from "~/_utils/utils";

export class DropdownSelectButton {
  #buttonId;
  #buttonLabelId;

  constructor(onClick, name) {
    this.onClick = onClick;
    this.buttonID = name;
    this.buttonLabelID = name;
  }

  set buttonID(name) {
    this.#buttonId = DOM_ELEMENT_ID.btn + name;
  }

  get buttonID() {
    return this.#buttonId;
  }

  set buttonLabelID(name) {
    this.#buttonLabelId = DOM_ELEMENT_ID.btnLabel + name;
  }

  get buttonLabelID() {
    return this.#buttonLabelId;
  }

  get dropdownBtn() {
    return ElementHandler.getByID(this.buttonID);
  }

  get dropdownBtnLabel() {
    return ElementHandler.getByID(this.buttonLabelID);
  }

  generateDropdownBtn(params) {
    const button = ElementGenerator.generateButton(DROPDOWN_BNT, this.onDropdownClick.bind(this));
    button.addEventListener("keydown", this.onDropdownKey.bind(this));
    ElementHandler.setID(button, this.buttonID);
    AriaHandler.setAriaLabel(button, params.selectText);
    button.setAttribute("aria-haspopup", "listbox");
    AriaHandler.setAriaExpanded(button, params.expanded);
    ElementHandler.setDisabled(button, params.disabled);
    const buttonContent = `<div id="${this.buttonLabelID}" class="${DOM_ELEMENT_CLASS.btnLabel}">${params.displayValue}</div><div class="${DOM_ELEMENT_CLASS.btnCaret}"></div>`;
    button.innerHTML = buttonContent;
    return button;
  }

  onDropdownClick(event) {
    preventInteraction(event);
    this.dropdownBtn.then(button => {
      const nextState = !AriaHandler.getAriaExpanded(button);
      this.toggleButtonState(button, nextState);
      this.onClick(nextState);
    });
  }

  toggleButtonState(button, expandState) {
    AriaHandler.setAriaExpanded(button, expandState);
    expandState ? button.blur() : button.focus();
  }

  toggleButtonStateAndSubmit(button, nextState) {
    this.toggleButtonState(button, nextState);
    this.onClick(nextState);
  }

  onDropdownKey(event) {
    preventInteraction(event);
    const keyCode = event.which;
    this.dropdownBtn.then(button => {
      switch (keyCode) {
        case 40: // Down Arrow
          this.toggleButtonStateAndSubmit(button, true);
          break;
        case 38: // Up Arrow
          this.toggleButtonStateAndSubmit(button, false);
          break;
        case 13: // Enter
          this.toggleButtonStateAndSubmit(button, !AriaHandler.getAriaExpanded(button));
          break;
      }
    });
  }

  disable() {
    this.dropdownBtn.then(button => {
      ElementHandler.setDisabled(button, true);
      AriaHandler.setAriaExpanded(button, false);
    });
  }

  enable() {
    this.dropdownBtn.then(button => ElementHandler.setDisabled(button, false));
  }

  setButtonLabel(displayValue) {
    this.dropdownBtnLabel.then(btnLabel => btnLabel.innerHTML = displayValue);
  }

  focus() {
    this.dropdownBtn.then(button => button.focus());
  }

  blur() {
    this.dropdownBtn.then(button => button.blur());
  }

  toggleButtonExpandState(expandState) {
    this.dropdownBtn.then(button => this.toggleButtonState(button, expandState));
  }

}
