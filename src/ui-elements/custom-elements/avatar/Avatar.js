import './avatar.scss';

export default class Avatar extends HTMLElement {

  constructor() {
    super();
  }

}

customElements.define('app-avatar', Avatar);