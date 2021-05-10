
import './dropdown-panel.scss';
import { TEMPLATE, DOM_ELEMENT_CLASS, ATTRIBUTES } from './dropdown-panel.constants';
import { parseBoolean, definedString } from 'UTILS';
import { ElementHandler, AriaHandler, HeightAnimation, TemplateGenerator } from 'UI_ELEMENTS';

export default class DropdowPanel extends HTMLElement {
  #content;
  #animationScale;
  #animationStyles;
  #attributeUpdateHandler;

  constructor() {
    super();
    this.#attributeUpdateHandler = new Map();
  }

  get #expanded() {
    const expanded = this.getAttribute(ATTRIBUTES.expanded);
    return parseBoolean(expanded);
  }

  get #connected() {
    return !!this.#attributeUpdateHandler.size;
  }

  static get observedAttributes() {
    return Object.values(ATTRIBUTES);
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    if (this.#attributeUpdateHandler.has(attrName) && oldVal !== newVal) {
      this.#attributeUpdateHandler.get(attrName)();
    }
  }

  connectedCallback() {
    ElementHandler.addStyleClass(this, DOM_ELEMENT_CLASS.panel);
    const panelContent = this.innerHTML;
    this.innerHTML = '';
    const template = definedString(panelContent) ? TemplateGenerator.generate(TEMPLATE, { panelContent }) : TemplateGenerator.generate(TEMPLATE);
    this.append(template);
    this.#content = this.querySelector(`.${DOM_ELEMENT_CLASS.content}`);
    this.#setUpAnimation();
    this.#toggle();
    this.#setUpdateHandling();
  }

  disconnectedCallback() {
    HeightAnimation.removeAnimationStyles(this.id);
  }

  updateContent(content) {
    this.closeAndPauseUpdates();
    ElementHandler.clearContent(this.#content);
    this.#content.append(content);
    this.onContentUpdated();
  }

  closeAndPauseUpdates() {
    this.#attributeUpdateHandler = new Map();
    this.#collapse();
  }

  onContentUpdated() {
    this.#setUpAnimation();
    this.#toggle();
    this.#setUpdateHandling();
  }

  #setUpdateHandling() {
    this.#attributeUpdateHandler.set(ATTRIBUTES.expanded, this.#toggle.bind(this));
  }

  #setUpAnimation() {
    this.#animationScale = HeightAnimation.getAnimationScale(this);
    this.#animationStyles = HeightAnimation.generateHeightAnimation(this.id, this.#animationScale.scale, 0.5);
  }

  #toggle() {
    this.#expanded ? this.#expand() : this.#collapse();
    this.#handleContentAria();
  }

  #expand() {
    this.#setTransformScale(this);
    this.#setTransformScale(this.#content);
    this.#animateExpand();
  }

  #collapse() {
    this.#setTransformScale(this, this.#animationScale.scale);
    this.#setTransformScale(this.#content, this.#animationScale.inverseScale);
    this.#animateCollapse();
  }

  #getScaleStyles(scale = 1) {
    const transform = `scaleY(${scale})`;
    return { transform };
  }

  #setTransformScale(element, scale = 1) {
    const styles = this.#getScaleStyles(scale);
    ElementHandler.updateElementStyles(element, styles);
  }

  #animateCollapse() {
    if (this.#animationStyles && this.#connected) {
      ElementHandler.swapStyleClass(this, this.#animationStyles.expand, this.#animationStyles.collapse);
      ElementHandler.swapStyleClass(this.#content, this.#animationStyles.expandContent, this.#animationStyles.collapseContent);
    }
  }

  #animateExpand() {
    if (this.#animationStyles && this.#connected) {
      ElementHandler.swapStyleClass(this, this.#animationStyles.collapse, this.#animationStyles.expand);
      ElementHandler.swapStyleClass(this.#content, this.#animationStyles.collapseContent, this.#animationStyles.expandContent);
    }
  }

  #handleContentAria() {
    const tabindex = this.#expanded ? -1 : 0;
    AriaHandler.setAriaHidden(this.#content, !this.#expanded);
    AriaHandler.setTabindex(this.#content, tabindex);
  }
}

customElements.define('app-dropdown-panel', DropdowPanel);