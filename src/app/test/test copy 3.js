'use strict';
import './test.scss';

import { easeStep, calculateAnimationOffset } from './height-animation';




class Test {
  constructor() {
    this._menu = document.querySelector('.js-menu');
    this._menuContents = this._menu.querySelector('.js-menu-contents');
    this._menuToggleButton = this._menu.querySelector('.js-menu-toggle');
    this._menuTitle = this._menu.querySelector('.js-menu-title');

    this._expanded = true;

    this._id = 123;
    this._collapsed;

    this.expand = this.expand.bind(this);
    this.collapse = this.collapse.bind(this);
    this.toggle = this.toggle.bind(this);

    this._calculateScales();
    this._createEaseAnimations();
    this._menuToggleButton.addEventListener('click', this.toggle);

    this.collapse();

  }

  toggle() {
    this._expanded ? this.collapse() : this.expand();
  }

  _calculateScales() {
    const collapsed = this._menuTitle.getBoundingClientRect();
    const expanded = this._menu.getBoundingClientRect();

    this._collapsed = {
      x: collapsed.width / expanded.width,
      y: collapsed.height / expanded.height
    }
  }


  collapse() {
    if (!this._expanded) {
      return;
    }

    this._expanded = false;

    var y = this._collapsed.y;
    var invY = 1 / y;

    this._menu.style.transform = `scaleY(${y})`;
    this._menuContents.style.transform = `scaleY(${invY})`;
    //this._handleAccessbility(false);


    this._applyAnimation({ expand: false });
  }

  expand() {
    if (this._expanded) {
      return;
    }
    this._expanded = true;

    this._menu.style.transform = `scaleY(1)`;
    this._menuContents.style.transform = `scaleY(1)`;
    // this._handleAccessbility(true);

    console.log();


    this._applyAnimation({ expand: true });

  }




  _applyAnimation({ expand } = opts) {
    this._menu.classList.remove('menu--expanded');
    this._menu.classList.remove('menu--collapsed');

    this._menuContents.classList.remove('menu__contents--expanded');
    this._menuContents.classList.remove('menu__contents--collapsed');


    if (expand) {
      this._menu.classList.add('menu--expanded');
      this._menuContents.classList.add('menu__contents--expanded');
      return;
    }

    this._menu.classList.add('menu--collapsed');
    this._menuContents.classList.add('menu__contents--collapsed');
  }



  #getStyles() {
    const stylesClass = `dropdown-styles__${this._id}`;
    let styles = document.querySelector(stylesClass);
    if (styles) {
      return styles;
    }

    styles = document.createElement('style');
    styles.classList.add(stylesClass);
    return styles;
  }





  _createEaseAnimations() {
    let menuEase = this.#getStyles();


    const menuExpandAnimation = [];
    const menuExpandContentsAnimation = [];
    const menuCollapseAnimation = [];
    const menuCollapseContentsAnimation = [];

    for (let step = 0; step <= 100; step++) {
      const easedStep = easeStep(step / 100);
      // Expand animation
      // const expandFrame = calculateAnimationOffset(step, easedStep, this._collapsed.y);
      // menuExpandAnimation.push(expandFrame.outerAnimation);
      // menuExpandContentsAnimation.push(expandFrame.innerAnimation);

      // Expand animation.
      this._append({
        step,
        easedStep,
        startY: this._collapsed.y,
        endY: 1,
        outerAnimation: menuExpandAnimation,
        innerAnimation: menuExpandContentsAnimation
      });

      // Collapse animation.
      this._append({
        step,
        easedStep,
        startX: 1,
        startY: 1,
        endX: this._collapsed.x,
        endY: this._collapsed.y,
        outerAnimation: menuCollapseAnimation,
        innerAnimation: menuCollapseContentsAnimation
      });
    }


    console.log(menuExpandAnimation[0]);


    menuEase.textContent = `
      @keyframes menuExpandAnimation {
        ${menuExpandAnimation.join('')}
      }

      @keyframes menuExpandContentsAnimation {
        ${menuExpandContentsAnimation.join('')}
      }
      
      @keyframes menuCollapseAnimation {
        ${menuCollapseAnimation.join('')}
      }

      @keyframes menuCollapseContentsAnimation {
        ${menuCollapseContentsAnimation.join('')}
      }`;

    document.head.appendChild(menuEase);
    return menuEase;
  }

  _append({
    i,
    step,
    startY,
    endY,
    outerAnimation,
    innerAnimation } = opts) {


    const yScale = startY + (endY - startY) * step;


    const invScaleY = 1 / yScale;


    outerAnimation.push(`
      ${i}% {
        transform: scaleY(${yScale});
      }`);

    innerAnimation.push(`
      ${i}% {
        transform: scaleY(${invScaleY});
      }`);
  }







}

new Test()