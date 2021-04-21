import './loader.scss';
import { UIElementHandler } from '../../ui-element.handler';

const template = `<svg width='32' height='32'>
                    <circle class='loader-spinner spin' cx='16' cy='16' r='14' fill='none'></circle>
                  </svg>`;

class Loader extends HTMLElement {

  constructor() {
    super();
  }

  get #spinner() {
    return this.querySelector('.loader-spinner');
  }

  connectedCallback() {
    this.innerHTML = template;
  }

  display() {
    UIElementHandler.display(this);
    this.#startSpinner();
  }

  hide() {
    UIElementHandler.hide(this);
    this.#stopSpinner();
  }

  #startSpinner() {
    const spinner = this.#spinner;
    if (spinner) {
      UIElementHandler.addStyleClass(spinner);
    }
  }

  #stopSpinner() {
    const spinner = this.#spinner;
    if (spinner) {
      UIElementHandler.removeStyleClass(spinner);
    }
  }

}

customElements.define('app-loader', Loader);