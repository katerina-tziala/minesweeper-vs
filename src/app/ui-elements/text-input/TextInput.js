import './text-input.scss';
import { ElementHandler } from '../../element-handler';

const template = `<label class='text-input__label'>username</label>
<input class='text-input__input' type='text' placeholder='username' name='username'
value='kate' autocomplete='off'/>`;

class TextInput extends HTMLElement {

  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = template;
  }

}

customElements.define('app-text-input', TextInput);