'use strict';
import './test.scss';
class Test {
    constructor() {
        this._menu = document.querySelector('.js-menu');
        this._menuContents = this._menu.querySelector('.menu__contents');
        this._menuToggleButton = this._menu.querySelector('.js-menu-toggle');
  
        this._expanded = true;
      
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

    _calculateScales () {
      const collapsed = this._menuToggleButton.getBoundingClientRect();
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
       
          
          this._applyAnimation({expand: true});
          
    }

 
  

    _applyAnimation({ expand } = opts) {
        this._menu.classList.remove('menu--expanded');
        this._menu.classList.remove('menu--collapsed');
        this._menuContents.classList.remove('menu__contents--expanded');
        this._menuContents.classList.remove('menu__contents--collapsed');


        this._menuContents.className = 'menu__contents';
        
        if (expand) {
            this._menu.classList.add('menu--expanded');
            this._menuContents.classList.add('menu__contents--expanded');
            return;
        }

        this._menu.classList.add('menu--collapsed');
        this._menuContents.classList.add('menu__contents--collapsed');
    }

   

    _createEaseAnimations() {
        let menuEase = document.querySelector('.menu-ease');
        if (menuEase) {
            return menuEase;
        }

        //
        menuEase = document.createElement('style');
        menuEase.classList.add('menu-ease');

        const menuExpandAnimation = [];
        const menuExpandContentsAnimation = [];
        const menuCollapseAnimation = [];
        const menuCollapseContentsAnimation = [];
        for (let i = 0; i <= 100; i++) {
            const step = this._ease(i / 100);


            // Expand animation.
            this._append({
                i,
                step,
                startY: this._collapsed.y,
                endY: 1,
                outerAnimation: menuExpandAnimation,
                innerAnimation: menuExpandContentsAnimation
            });

            // Collapse animation.
            this._append({
                i,
                step,
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

    _clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    _ease(v, pow = 4) {
        v = this._clamp(v, 0, 1);

        return 1 - Math.pow(1 - v, pow);
    }
}

new Test()