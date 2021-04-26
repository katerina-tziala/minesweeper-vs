import './avatar.scss';

export class Avatar extends HTMLElement {

  constructor() {
    super();
  }

}

customElements.define('app-avatar', Avatar);