import "./loader.scss";
import { ElementHandler } from "../../element-handler";

const template = `<svg width='32' height='32'>
                    <circle class='loader-spinner spin' cx='16' cy='16' r='14' fill='none'></circle>
                  </svg>`;

class Loader extends HTMLElement {

  constructor() {
    super();
  }

  get spinner() {
    return new Promise((resolve, reject) => {
      const spinner = this.querySelector(".loader-spinner");
      spinner
        ? resolve(spinner)
        : reject(`spinner does not exist`);
    });
  }

  connectedCallback() {
    this.innerHTML = template;
  }

  display() {
    ElementHandler.display(this);
    this.spinner.then(spinner => ElementHandler.addStyleClass(spinner));
  }

  hide() {
    ElementHandler.hide(this);
    this.spinner.then(spinner => ElementHandler.removeStyleClass(spinner));
  }

}

customElements.define("app-loader", Loader);