import './dilemma-selection.scss';
import { ATTRIBUTES, CONTENT, DOM_ELEMENT_CLASS } from './dilemma-selection.constants';
import { DilemmaChoiceType } from './dilemma-choice-type.enum';
import { DilemmaSelectionTemplateHelper as TemplateHelper } from './DilemmaSelectionTemplateHelper';

export default class DilemmaSelection extends HTMLElement {
  #renderedType;
  #isShaking;
  #buttonListeners;
  #shakeEndListener;
  #clickListener;

  constructor() {
    super();
    this.#buttonListeners = new Map();
    this.#isShaking = false;
  }

  get #contentContainer() {
    return this.querySelector(`.${DOM_ELEMENT_CLASS.content}`);
  }

  get #type() {
    return this.getAttribute(ATTRIBUTES.type);
  }

  static get observedAttributes() {
    return Object.values(ATTRIBUTES);
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (oldVal !== newVal) {
      this.#onInit();
    }
  }

  connectedCallback() {
    if (!this.#clickListener) {
      this.#clickListener = this.#detectOutsideContentClick.bind(this);
      this.addEventListener('click', this.#clickListener);
    }
    this.#onInit();
  }

  disconnectedCallback() {
    if (this.#clickListener) {
      this.removeEventListener('click', this.#clickListener);
      this.#clickListener = undefined;
    }
    this.#stopShaking();
    this.#removebuttonListeners();
    this.#renderedType = undefined;
  }

  #detectOutsideContentClick(event) {
    const container = event.target.closest(`.${DOM_ELEMENT_CLASS.content}`);
    if (!container && !this.#isShaking) {
      event.preventDefault();
      event.stopPropagation();
      this.#shakeContent();
    }
  }

  #shakeContent() {
    this.#isShaking = true;
    const contentContainer = this.#contentContainer;
    if (contentContainer && !this.#shakeEndListener) {
      TemplateHelper.shakeContent(contentContainer);
      this.#shakeEndListener = this.#stopShaking.bind(this);
      contentContainer.addEventListener('animationend', this.#shakeEndListener);
    }
  }

  #stopShaking() {
    this.#isShaking = false;
    const contentContainer = this.#contentContainer;
    if (contentContainer && this.#shakeEndListener) {
      TemplateHelper.stopContentShaking(contentContainer);
      contentContainer.removeEventListener('animationend', this.#shakeEndListener);
      this.#shakeEndListener = undefined;
    }
  }

  #onInit() {
    this.#stopShaking();
    const type = this.#type;
    if (this.#renderedType !== type) {
      this.#renderedType = type;
      this.#render();
    }
  }

  #render() {
    const content = CONTENT[this.#renderedType];
    const template = TemplateHelper.generateTemplate(content);
    this.appendChild(template);
    this.#setbuttonListeners();
  }

  #setbuttonListeners() {
    Object.keys(DilemmaChoiceType).forEach(type => this.#setButtonListener(type));
  }

  #setButtonListener(type) {
    const button = this.#getButton(type);
    if (button) {
      const action = () => this.#onChoiceSelected(type);
      this.#buttonListeners.set(type, action);
      button.addEventListener('click', action);
    }
  }

  #removebuttonListeners() {
    Object.keys(DilemmaChoiceType).forEach(type => this.#removeButtonListener(type));
    this.#buttonListeners = new Map();
  }

  #removeButtonListener(type) {
    if (this.#buttonListeners.has(type)) {
      const action = this.#buttonListeners.get(type);
      this.#removeListenerFromButton(type, action);
      this.#buttonListeners.delete(type, action);
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
    this.#stopShaking();
    const event = new CustomEvent('onChoiceSelected', { detail: { value: selectedChoice } });
    this.dispatchEvent(event);
  }

}

customElements.define('app-dilemma-selection', DilemmaSelection);