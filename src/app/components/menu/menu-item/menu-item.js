"use strict";
import {
  ElementHandler,
  ElementGenerator,
  AriaHandler
} from "HTML_DOM_Manager";
import { DOM_ELEMENT_CLASS, MENU_CONTENT } from "./menu-item.constants";

export class MenuItem {
  #type;
  #disabled;
  #content;
  #onSelected;

  constructor(id, onSelected, disabled = false) {
    this.#type = id;
    this.#disabled = disabled;
    this.#onSelected = onSelected;
    this.#content = MENU_CONTENT[this.#type];
  }

  get #element() {
    return ElementHandler.getByID(this.#type);
  }

  #generateMenuItemIcon() {
    const styles = [DOM_ELEMENT_CLASS.icon, DOM_ELEMENT_CLASS.iconIdentifier + this.#type];
    return ElementGenerator.generateContainer(styles);
  }

  #generateMenuItemContent() {
    const content = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.content]);
    if (this.#content) {
      const header = this.#generateHeader();
      const details = this.#generateDetails();
      content.append(header, details);
    }
    return content;
  }

  #generateHeader() {
    const header = document.createElement("h2");
    header.innerHTML = this.#content.title;
    return header;
  }

  #generateDetails() {
    const details = document.createElement("p");
    details.innerHTML = `<span>${this.#content.details}</span>`;
    return details;
  }

  #setItemState(element) {
    this.#disabled ? this.#disable(element) : this.#enable(element);
  }

  #enable(element) {
    ElementHandler.removeStyleClass(element, DOM_ELEMENT_CLASS.menuItemDisabled);
    AriaHandler.setTabindex(element, 1);
  }

  #disable(element) {
    ElementHandler.addStyleClass(element, DOM_ELEMENT_CLASS.menuItemDisabled);
    AriaHandler.setTabindex(element, -1);
  }

  #onKeyDown(event) {
    if (event.keyCode === 13 || event.which === 13) {
      this.#onSelect();
    }
  }

  #onSelect() {
    if (!this.#disabled && this.#onSelected) {
      this.#onSelected(this.#type);
    }
  }

  generateView() {
    const menuItem = document.createElement("menuitem");
    ElementHandler.addStyleClass(menuItem, DOM_ELEMENT_CLASS.menuItem);
    ElementHandler.setID(menuItem, this.#type);
    this.#setItemState(menuItem);
    const icon = this.#generateMenuItemIcon();
    const content = this.#generateMenuItemContent();
    menuItem.append(icon, content);
    menuItem.addEventListener("click", this.#onSelect.bind(this));
    menuItem.addEventListener("keydown", this.#onKeyDown.bind(this));
    return menuItem;
  }

  toggleState(disabled) {
    this.#disabled = disabled;
    this.#element.then(element => this.#setItemState(element));
  }
}
