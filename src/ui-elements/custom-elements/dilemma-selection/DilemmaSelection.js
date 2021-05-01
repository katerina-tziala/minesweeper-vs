import './dilemma-selection.scss';
import { ATTRIBUTES, CONTENT } from './dilemma-selection.constants';
import { DilemmaSelectionType } from './dilemma-selection-type.enum';
import { DilemmaChoiceType } from './dilemma-choice-type.enum';
import { DilemmaSelectionTemplateHelper as TemplateHelper } from './DilemmaSelectionTemplateHelper';


export default class DilemmaSelection extends HTMLElement {
  #eventListeners;
  #renderedType;

  constructor() {
    super();
    this.#eventListeners = new Map();
  }

  static get observedAttributes() {
    return Object.values(ATTRIBUTES);
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    this.#onInit();
  }

  connectedCallback() {
    this.#onInit();
  }

  disconnectedCallback() {
    this.#removeEventListeners();
    this.#renderedType = undefined;
  }

  get #type() {
    const type = this.getAttribute('type');
    if (Object.values(DilemmaSelectionType).includes(type)) {
      return type;
    }
    return DilemmaSelectionType.Default;
  }

  #onInit() {
    const type = this.#type;
    if (this.#renderedType !== type) {
      this.#renderedType = type;
      this.#render();
    }
  }

  #render() {
    const content = CONTENT[this.#renderedType];
    if (content) {
      const template = TemplateHelper.generateTemplate(content);
      this.innerHTML = template;
      this.#setEventListeners();
    }
  }

  #setEventListeners() {
    Object.keys(DilemmaChoiceType).forEach(type => this.#setButtonListener(type));
  }

  #setButtonListener(type) {
    const button = this.#getButton(type);
    if (button) {
      const action = () => this.#onChoiceSelected(type);
      this.#eventListeners.set(type, action);
      button.addEventListener('click', action);
    }
  }

  #removeEventListeners() {
    Object.keys(DilemmaChoiceType).forEach(type => this.#removeButtonListener(type));
    this.#eventListeners = new Map();
  }

  #removeButtonListener(type) {
    if (this.#eventListeners.size) {
      const action = this.#eventListeners.get(type);
      this.#removeListenerFromButton(type, action);
      this.#eventListeners.delete(type, action);
    }
  }

  #removeListenerFromButton(type, action) {
    const button = this.#getButton(type);
    if (button) {
      button.removeEventListener('click', action);
    }
  }

  #getButton(choiceType) {
    return this.querySelector(`.dilemma-selection__${choiceType}`);
  }

  #onChoiceSelected(selectedChoice) {
    const event = new CustomEvent('onChoiceSelected', { detail: { value: selectedChoice } });
    this.dispatchEvent(event);
  }

}

customElements.define('app-dilemma-selection', DilemmaSelection);