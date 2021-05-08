import './dropdown.scss';
import { TEMPLATE, DOM_ELEMENT_CLASS, ATTRIBUTES } from './dropdown.constants';
import { TemplateGenerator } from '../../template-generator';
import { AriaHandler } from '../../aria-handler';

export default class Dropdown extends HTMLElement {
  #expanded = false;

  #panel;
  #button;

  #collapsedScale = { width: 0, height: 0 };

  constructor() {
    super();

  }


  static get observedAttributes() {
    return Object.values(ATTRIBUTES);
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    // if (this.#renderedType && this.#attributeUpdateHandler.has(attrName) && oldVal !== newVal) {
    //   this.#attributeUpdateHandler.get(attrName)();
    // }
  }

  connectedCallback() {
    this.innerHTML = TEMPLATE;

    this.#button = this.querySelector(`.${DOM_ELEMENT_CLASS.button}`);
    this.#panel = this.querySelector(`.${DOM_ELEMENT_CLASS.panel}`);

    console.log('connectedCallback');
    console.log('Dropdown');
    this.#calculateCollapsedScale();

    console.log(this.#collapsedScale);


    // this.#panel.animate([{ opacity: 1 },
    // { opacity: 0.1, offset: 0.7 },
    // { opacity: 0 }],
    //   2000);
  }


  disconnectedCallback() {

    console.log('disconnectedCallback');
  }

  #calculateCollapsedScale() {
    const collapsed = this.#button.getBoundingClientRect();
    const expanded = this.#panel.getBoundingClientRect();

    // Object.keys(this.#collapsedScale).forEach(key => {
    //   this.#collapsedScale[key] = collapsed[key] / expanded[key];
    // })
    this.#collapsedScale.width = collapsed.width / expanded.width;
    this.#collapsedScale.height = collapsed.height / expanded.height;
  }


  // createKeyframeAnimation() {
  //   // Figure out the size of the element when collapsed.
  //   let { x, y } = calculateCollapsedScale();
  //   let animation = '';
  //   let inverseAnimation = '';

  //   for (let step = 0; step <= 100; step++) {
  //     // Remap the step value to an eased one.
  //     let easedStep = ease(step / 100);

  //     // Calculate the scale of the element.
  //     const xScale = x + (1 - x) * easedStep;
  //     const yScale = y + (1 - y) * easedStep;

  //     animation += `${step}% {
  //       transform: scale(${xScale}, ${yScale});
  //     }`;

  //     // And now the inverse for the contents.
  //     const invXScale = 1 / xScale;
  //     const invYScale = 1 / yScale;
  //     inverseAnimation += `${step}% {
  //       transform: scale(${invXScale}, ${invYScale});
  //     }`;

  //   }

  //   return `
  //   @keyframes menuAnimation {
  //     ${animation}
  //   }

  //   @keyframes menuContentsAnimation {
  //     ${inverseAnimation}
  //   }`;
  // }




  // #clamp(value, min, max) {
  //   return Math.max(min, Math.min(max, value));
  // }

  // ease(v, pow = 4) {
  //   const easeValue = this.#clamp(v, 0, 1);

  //   return 1 - Math.pow(1 - easeValue, pow);
  // }







}

customElements.define('app-dropdown', Dropdown);