'use strict';
import './test.scss';
import * as Animation from './height-animation';


class Test {
  constructor() {
    this._menu = document.querySelector('.js-menu');
    this._menuContents = this._menu.querySelector('.js-menu-contents');
    this._menuToggleButton = this._menu.querySelector('.js-menu-toggle');
  

    this._expanded = true;
    this._animate = false;
    

    this.heightScale = this.#calculateScale();


    this.animationScale = Animation.getAnimationScale(this._menu, this._menuToggleButton);

    console.log(this.animationScale);

    this.expand = this.expand.bind(this);
    this.collapse = this.collapse.bind(this);
    this.toggle = this.toggle.bind(this);


    this._createEaseAnimations();
    this._addEventListeners();

    this.collapse();
    this.activate();
  }







  activate() {
    this._menu.classList.add('menu--active');
    this._animate = true;
  }

  _addEventListeners() {
    this._menuToggleButton.addEventListener('click', this.toggle);
  }
  toggle() {
    if (this._expanded) {
      this.collapse();
      return;
    }

    this.expand();
  }



  collapse() {
    if (!this._expanded) {
      return;
    }
    this._expanded = false;

    this._menu.style.transform = `scaleY(${this.animationScale.scale})`;
    this._menuContents.style.transform = `scaleY(${this.animationScale.inverseScale})`;
  
    if (!this._animate) {
      return;
    }
    this._applyAnimation({ expand: false });
  }

  expand() {
    if (this._expanded) {
      return;
    }
    this._expanded = true;
    this._menu.style.transform = `scaleY(1)`;
    this._menuContents.style.transform = `scaleY(1)`;
    if (!this._animate) {
      return;
    }

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

  #calculateScale() {
    const collapsed = this._menuToggleButton.getBoundingClientRect();
    const expanded = this._menu.getBoundingClientRect();
    const scale = collapsed.height / expanded.height;
    return scale;
  }

  _createEaseAnimations() {
    const id = 'app-dropdown-toggle-test';
    Animation.setUpElementAnimation(id, this.heightScale, this._menu);
  }

}


new Test()