import './icon-button.scss';

export class IconButton extends HTMLElement {

  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `<button class='app-icon-button'></button>`;
    // this.#input = this.querySelector(`.${DOM_ELEMENT_CLASS.input}`);
    // this.#label = this.querySelector(`.${DOM_ELEMENT_CLASS.label}`);
    // this.#inputField = this.querySelector(`.${DOM_ELEMENT_CLASS.inputField}`);
    // this.#setInputListeners();
    // this.#inputError = this.querySelector(`.${DOM_ELEMENT_CLASS.inputError}`);
    // this.#setElementName();
    // this.#setElementValue();
    // this.#value ? this.#focus() : this.#focusout();
    // this.#handleErrorDisplay();
  }

  disconnectedCallback() {
   console.log("disconnectedCallback");
  }

}

customElements.define('app-icon-button', IconButton);