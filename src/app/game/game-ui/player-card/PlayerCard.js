'use strict';
import './player-card.scss';

import './player-turns/PlayerTurns';
import '~/ui-elements/custom-elements/avatar/Avatar';


import { ATTRIBUTES, TEMPLATE, DOM_ELEMENT_CLASS } from './player-card.constants';

export default class PlayerCard extends HTMLElement {

  constructor() {
    super();

  }

  static get observedAttributes() {
    return Object.values(ATTRIBUTES);
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    console.log('attributeChangedCallback PlayerCard ', attrName);
    // upgrated
  }

  connectedCallback() {
    console.log('connectedCallback PlayerCard');
    this.innerHTML = TEMPLATE;

    
  }

  disconnectedCallback() {
    console.log('disconnectedCallback PlayerCard');
  }

  adoptedCallback() {
    console.log('adoptedCallback PlayerCard');
  }

}

customElements.define('app-player-card', PlayerCard);