'use strict';
import '~/ui-elements/custom-elements/digital-counters/digital-counter/DigitalCounter';
import './flags-counter.scss';
import { ATTRIBUTES, TEMPLATES, DOM_ELEMENT_CLASS } from './flags-counter.constants';
import { TemplateGenerator, ElementHandler } from 'UI_ELEMENTS';
export default class FlagsCounter extends HTMLElement {

  constructor() {
    super();

  }

  get flags() {
    return this.getAttribute(ATTRIBUTES.flags).split(',');
  }

  static get observedAttributes() {
    return Object.values(ATTRIBUTES);
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    console.log('attributeChangedCallback FlagsCounter ', attrName);
    // upgrated
  }

  connectedCallback() {
    const icon = TemplateGenerator.generate(TEMPLATES.iconHolder).childNodes[0];
    console.log('connectedCallback FlagsCounter');
    console.log(this.flags);

    const flags = this.flags;
    if (flags.length) {
      for (let index = 0; index < flags.length; index++) {
        const flagElement = TemplateGenerator.generate(TEMPLATES.flag).childNodes[0];
        const position = index + 1;
        ElementHandler.addStyleClass(flagElement, `${DOM_ELEMENT_CLASS.flag}--${position}`);
        ElementHandler.addStyleClass(flagElement, `${DOM_ELEMENT_CLASS.flag}--${flags[index]}`);
        
        icon.append(flagElement);
      }


    } else {
      icon.append(TemplateGenerator.generate(TEMPLATES.flag));
    }
    this.append(icon);
  }

  disconnectedCallback() {
    console.log('disconnectedCallback FlagsCounter');
  }

  adoptedCallback() {
    console.log('adoptedCallback FlagsCounter');
  }

}

customElements.define('app-flags-counter', FlagsCounter);