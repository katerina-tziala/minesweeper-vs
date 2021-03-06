"use strict";

import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";

import {
  DOM_ELEMENT_ID,
  DOM_ELEMENT_CLASS,
  CONTENT,
} from "./dropdown-select.constants";

import { replaceStringParameter } from "~/_utils/utils";

import { UserInput } from "../user-input";
import { DropdownSelectButton } from "./dropdown-select-button/dropdown-select-button";
import { DropdownSelectList } from "./dropdown-select-list";
import { DropdownSelectOptionsHandler } from "./dropdown-select-options-handler";

export class DropdownSelect extends UserInput {
  #options;
  #expanded;
  #selectLabel;
  #dropdownBtn;
  #dropdownList;
  #documentListeners = {};

  constructor(params, onValueChange, onExpand) {
    super(params.name, params.value, onValueChange);
    this.valid = true;
    this.selectLabel = params.selectLabel;
    this.expanded = false;
    this.options = params.options || [];
    this.#dropdownBtn = new DropdownSelectButton(
      this.onDropdownBtnClick.bind(this),
      this.name,
    );
    this.#dropdownList = new DropdownSelectList(
      this.onOptionSelected.bind(this),
      this.name,
    );
    this.onExpand = onExpand;
  }

  set options(options) {
    this.#options = DropdownSelectOptionsHandler.getSelectOptions(
      options,
      this.name,
      this.value,
    );
  }

  get options() {
    return this.#options;
  }

  set expanded(expanded) {
    this.#expanded = expanded;
  }

  get expanded() {
    return this.#expanded;
  }

  set selectLabel(selectLabel) {
    this.#selectLabel = selectLabel;
  }

  get selectLabel() {
    return this.#selectLabel;
  }

  get #containerID() {
    return DOM_ELEMENT_ID.dropdownContainer + this.name;
  }

  get selectText() {
    return this.selectLabel
      ? replaceStringParameter(CONTENT.selectText, this.selectLabel)
      : CONTENT.defaultSelectText;
  }

  get btnDisabled() {
    return DropdownSelectOptionsHandler.getOptionsListSize(this.options)
      ? false
      : true;
  }

  get btnDisplayValue() {
    const selectedOption = this.selectedOption;
    return selectedOption ? selectedOption.innerHTML : this.selectText;
  }

  get selectedOption() {
    return DropdownSelectOptionsHandler.getSelectedOptionByValue(
      this.options,
      this.value,
    );
  }

  updateOptions(options) {
    this.options = options;
    this.btnDisabled ? this.#dropdownBtn.disable() : this.#dropdownBtn.enable();
    this.#dropdownList.updateOptions(this.options);
  }

  generateInputField() {
    const dorpdownFragment = document.createDocumentFragment();
    const dropdownContainer = ElementGenerator.generateContainer(
      [DOM_ELEMENT_CLASS.container],
      this.#containerID,
    );
    const button = this.generateDropdownButton();
    const listbox = this.#dropdownList.generateDropdownListbox(
      this.options,
      this.selectText,
    );
    dropdownContainer.append(button, listbox);
    dorpdownFragment.append(dropdownContainer);
    return dorpdownFragment;
  }

  generateDropdownButton() {
    const dropdownParams = {
      displayValue: this.btnDisplayValue,
      selectText: this.selectText,
      expanded: this.btnDisabled ? false : this.expanded,
      disabled: this.btnDisabled,
    };
    return this.#dropdownBtn.generateDropdownBtn(dropdownParams);
  }

  onDropdownBtnClick(expand) {
    this.expanded = expand;
    this.#dropdownList.toggleList(this.expanded, this.selectedOption).then(() => {
      if (this.expanded) {
        this.#detectOutsideClick();
        return;
      } 
      this.#removeOutsideClick();
    });
  }

  #detectOutsideClick() {
    this.#documentListeners[this.name] = this.#collapseOnOutsideClick.bind(this);
    document.addEventListener("click", this.#documentListeners[this.name]);
  }

  #removeOutsideClick() {
    document.removeEventListener("click", this.#documentListeners[this.name]);
    this.#documentListeners = {};
  }

  onOptionSelected(selectedValue) {
    if (selectedValue && this.value !== selectedValue) {
      this.value = selectedValue;
      this.#dropdownBtn.setButtonLabel(this.btnDisplayValue);
      this.notifyForChanges();
    }
    this.expanded = false;
    this.#dropdownBtn.toggleButtonExpandState(this.expanded);
  }

  #collapseOnOutsideClick(event) {
    const container = event.target.closest(`#${this.#containerID}`);
    if (!container && this.expanded) {
      this.collapseDropdown();
    }
  }

  collapseDropdown() {
    ElementHandler.getByID(this.#containerID).then(() => {
        if (this.expanded) {
          this.#dropdownList.collapseListOnOutsideClick();
          this.#removeOutsideClick();
        }
        this.#dropdownBtn.blur();
      })
      .catch(() => {
        this.#removeOutsideClick();
      });
  }

}
