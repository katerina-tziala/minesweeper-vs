"use strict";

import {
  ElementHandler,
  ElementGenerator,
  AriaHandler,
} from "HTML_DOM_Manager";

import { clone } from "~/_utils/utils";

import {
  DOM_ELEMENT_ID,
  DOM_ELEMENT_CLASS,
  LISTBOX_ATTRIBUTES,
} from "./dropdown-select.constants";

import { DropdownSelectOptionsHandler } from "./dropdown-select-options-handler";
import { DropdownSelectOption } from "./dropdown-select-option";
import { DropdownSelectNavigation } from "./dropdown-select-navigation";

export class DropdownSelectList {
  #listboxId;
  #maxHeight;
  #listHeight;
  #size;

  constructor(onSelection, name, maxHeight = 85) {
    this.onSelection = onSelection;
    this.listboxId = name;
    this.maxHeight = maxHeight;
    this.listHeight = 0;
  }

  set size(size) {
    this.#size = size;
  }

  get size() {
    return this.#size;
  }

  set maxHeight(maxHeight) {
    this.#maxHeight = maxHeight;
  }

  set listHeight(height) {
    this.#listHeight = height > this.maxHeight ? this.maxHeight : height;
  }

  set listboxId(name) {
    this.#listboxId = DOM_ELEMENT_ID.listbox + name;
  }

  get maxHeight() {
    return this.#maxHeight;
  }

  get listHeight() {
    return this.#listHeight;
  }

  get listboxId() {
    return this.#listboxId;
  }

  get listbox() {
    return ElementHandler.getByID(this.listboxId);
  }

  get isScrollable() {
    return this.listHeight === this.maxHeight;
  }

  updateOptions(options) {
    this.listHeight = 0;
    this.listbox.then((listbox) => {
      ElementHandler.clearContent(listbox);
      listbox.append(
        DropdownSelectOptionsHandler.generateOptionsList(
          options,
          this.onOptionClick.bind(this),
        ),
      );
    });
  }

  setUpListHeight(listbox) {
    this.listHeight = DropdownSelectOptionsHandler.getOptionsHeight(
      listbox.childNodes,
    );
    ElementHandler.removeStyleClass(listbox,  DOM_ELEMENT_CLASS.listboxScrollable);
    if (this.isScrollable) {
      ElementHandler.addStyleClass(listbox,  DOM_ELEMENT_CLASS.listboxScrollable);
    }
  }

  getListBoxAttributes(options, selectText) {
    const selectedOption = DropdownSelectOptionsHandler.getSelectedOptionBySelected(
      options,
    );
    const attributes = clone(LISTBOX_ATTRIBUTES);
    attributes["id"] = this.listboxId;
    attributes["aria-label"] = selectText;
    if (selectedOption) {
      attributes["aria-activedescendant"] = selectedOption.attributes.id;
    }
    return attributes;
  }

  generateDropdownListbox(options, selectText) {
    const listboxContainer = ElementGenerator.generateContainer([
      DOM_ELEMENT_CLASS.listboxContainer,
    ]);
    const attributes = this.getListBoxAttributes(options, selectText);
    const listbox = this.generateOptionsListbox(options, attributes);
    AriaHandler.setTabindex(listbox, -1);
    listboxContainer.append(listbox);
    return listboxContainer;
  }

  generateOptionsListbox(options, attributes) {
    const listbox = document.createElement("ul");
    listbox.className = DOM_ELEMENT_CLASS.listbox;
    listbox.addEventListener("keydown", (event) => {
      DropdownSelectNavigation.manageNavigation(
        event,
        listbox,
        this.onEscape.bind(this),
        this.onEnter.bind(this),
      );
    });
    ElementHandler.setAttributes(listbox, attributes);
    listbox.append(
      DropdownSelectOptionsHandler.generateOptionsList(
        options,
        this.onOptionClick.bind(this),
      ),
    );
    return listbox;
  }

  onEscape() {
    this.toggleList(false);
    this.onSelection();
  }

  onEnter(activeDescendantID) {
    ElementHandler.getByID(activeDescendantID).then((activeDescendant) =>
      this.submitSelectedOption(activeDescendant),
    );
  }

  clearCurrentSelectedOption() {
    this.listbox
      .then((listbox) => {
        const activeDescendantID = AriaHandler.getActiveDescendant(listbox);
        return ElementHandler.getByID(activeDescendantID);
      })
      .then((activeDescendant) =>
        DropdownSelectOption.deselectOption(activeDescendant),
      );
  }

  setActiveDescendant(activeDescendantID) {
    this.listbox.then((listbox) =>
      AriaHandler.setActiveDescendant(listbox, activeDescendantID),
    );
  }

  onOptionClick(selectedOption) {
    this.clearCurrentSelectedOption();
    this.setActiveDescendant(ElementHandler.getID(selectedOption));
    this.submitSelectedOption(selectedOption);
  }

  submitSelectedOption(selectedOption) {
    this.toggleList(false);
    this.onSelection(selectedOption.getAttribute("value"));
  }

  toggleList(expanded, selectedOption) {
    this.listbox.then((listbox) => {
      if (!this.listHeight) {
        this.setUpListHeight(listbox);
      }
      expanded
        ? this.expandList(listbox, selectedOption)
        : this.collapseList(listbox);
    });
  }

  expandList(listbox, selectedOption) {
    clearTimeout(this.transitionTimeout);
    listbox.style.height = `${this.listHeight}px`;
    AriaHandler.setAriaExpanded(listbox, true);
    AriaHandler.setListTabindex(listbox.childNodes, 0);
    const activeDescendantID = selectedOption.attributes.id;
    AriaHandler.setActiveDescendant(listbox, activeDescendantID);
    ElementHandler.getByID(activeDescendantID).then((activeDescendant) => {
      DropdownSelectOption.selectOption(activeDescendant);
      listbox.scrollTo({
        top: activeDescendant.offsetTop,
        behavior: 'smooth',
      });
    });
  }

  collapseList(listbox) {
    listbox.style.height = "0px";
    AriaHandler.setListTabindex(listbox.childNodes, -1);
    const activeDescendantID = AriaHandler.getActiveDescendant(listbox);
    ElementHandler.getByID(activeDescendantID).then((activeDescendant) => {
      DropdownSelectOption.deselectOption(activeDescendant);
    });
    this.transitionTimeout = setTimeout(
      () => AriaHandler.setAriaExpanded(listbox, false),
      500,
    );
  }

  collapseListOnOutsideClick() {
    this.listbox.then((listbox) => {
      const activeDescendantID = AriaHandler.getActiveDescendant(listbox);
      ElementHandler.getByID(activeDescendantID).then((activeDescendant) =>
        this.submitSelectedOption(activeDescendant),
      );
    });
  }
}
