import './text-input.scss';
import { ElementHandler } from '../../element-handler';
import { DOM_ELEMENT_CLASS } from './text-input.constants';

const template = `<label class='text-input__label'>username</label>
<input class='text-input__input' type='text' name='username'
value='kate' autocomplete='off'/>`;

class TextInput extends HTMLElement {
  #label;
  #input;
  #labelListener;
 
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = template;
    this.setAttribute("focused", false);
    
    this.#label = this.querySelector(`.${DOM_ELEMENT_CLASS.label}`);
    this.#input = this.querySelector(`.${DOM_ELEMENT_CLASS.input}`);

    this.#addLabelListener();

    this.#input.addEventListener('focus', this.#focus.bind(this));
    this.#input.addEventListener('focusout', this.#focusout.bind(this));
  }

  #onLabelClick(event) {
    event.preventDefault();
    event.stopPropagation();
    this.#input.focus();
  }

  #focus() {
    this.#label.classList.add(DOM_ELEMENT_CLASS.focusedLabel);
    this.#removeLabelListener();
    this.setAttribute("focused", true);
  }

  #focusout() {
    this.#label.classList.remove(DOM_ELEMENT_CLASS.focusedLabel);
    this.#addLabelListener();
    this.setAttribute("focused", false);
  }

  #addLabelListener() {
    this.#labelListener = this.#onLabelClick.bind(this);
    this.#label.addEventListener('click', this.#labelListener);
  }

  #removeLabelListener() {
    if (this.#labelListener) {
      this.#label.removeEventListener('click', this.#labelListener);
    }
  }
}

customElements.define('app-text-input', TextInput);