// Constructor based on Google's ChromeLabs https://github.com/GoogleChromeLabs/ui-element-samples
class section {
  constructor (elem, index) {
    this._section = elem;
    this._sectionWrapper = this._section.parentNode;
    this._sectionItem = this._section.querySelector('.section-item');
    this._sectionItemTitle = this._section.querySelector('.section-item-title');
    this._sectionContent = this._section.querySelector('.section-item-content');

    this._expanded = true;
    this._animate = false;
    this._nFrames = 60;
    this._collapsed;
    this._index = index;

    this.expand = this.expand.bind(this);
    this.collapse = this.collapse.bind(this);
    this.toggle = this.toggle.bind(this);

    this._calculateScales();
    this._createEaseAnimations(index);
    this._addEventListeners();

    this.collapse();
    this._animate = true;
    
    this._sectionExpandAnimationName = '';
    this._sectionExpandContentsAnimationName = '';
    this._sectionCollapseAnimationName = '';
    this._sectionCollapseContentsAnimationName = '';

  }

  collapse () {
    if (!this._expanded) {
      return;
    }
    this._expanded = false;

    var y = this._collapsed.y;
    var invY = 1 / y;
    
    this._section.style.transform = `scaleY(${y})`;
    this._sectionItem.style.transform = `scaleY(${invY})`;
    this._handleAccessbility(false);

    if (!this._animate) {
      return;
    }

    this._applyAnimation({expand: false});
  }

  expand () {
    if (this._expanded) {
      return;
    }
    this._expanded = true;

    this._section.style.transform = `scaleY(1)`;
    this._sectionItem.style.transform = `scaleY(1)`;
    this._handleAccessbility(true);

    if (!this._animate) {
      return;
    }
    
    this._applyAnimation({expand: true});
    
  }

  toggle () {
    
    if (this._expanded) {
      requestAnimationFrame(this.collapse);
      return;
    }
    
    requestAnimationFrame(this.expand);

  }

  _handleAccessbility (isExpand) {
    var tabindexValue = isExpand ? 0 : -1; 
    this._sectionItemTitle.setAttribute('aria-expanded', isExpand);
    this._sectionContent.setAttribute('aria-hidden', !isExpand);
    this._sectionContent.setAttribute('tabindex', tabindexValue);
  }
  
  _addEventListeners () {
    this._sectionItemTitle.addEventListener('click', this.toggle);
  }

  _applyAnimation ({expand}=opts) {
    this._section.classList.remove('is--expanded');
    this._section.classList.remove('is--collapsed');

    if (expand) {
      this._section.classList.add('is--expanded');
      return;
    }

    this._section.classList.add('is--collapsed');
    
  }

  _calculateScales () {
    var collapsed = this._sectionItemTitle.getBoundingClientRect();
    var expanded = this._section.getBoundingClientRect();
    
    // create css variable with collapsed height, to apply on the wrapper
    this._sectionWrapper.style.setProperty('--title-height', parseInt(collapsed.height) + 'px');

    this._collapsed = {
      y: collapsed.height / expanded.height
    }
  }

  _createEaseAnimations (index) {
    var sectionEase = document.querySelector('.section-animations');
    if (!sectionEase) {
      sectionEase = document.createElement('style');
      sectionEase.classList.add('section-animations');
    }

    var sectionExpandAnimation = [];
    var sectionExpandContentsAnimation = [];
    var sectionCollapseAnimation = [];
    var sectionCollapseContentsAnimation = [];

    var percentIncrement = 100 / this._nFrames;

    for (var i = 0; i <= this._nFrames; i++) {
      var step = this._ease(i / this._nFrames).toFixed(5);
      var percentage = (i * percentIncrement).toFixed(5);
      var startY = this._collapsed.y;
      var endY = 1;

      // Expand animation.
      this._append({
        percentage,
        step,
        startY,
        endY,
        outerAnimation: sectionExpandAnimation,
        innerAnimation: sectionExpandContentsAnimation
      });

      // Collapse animation.
      this._append({
        percentage,
        step,
        startY: 1,
        endY: this._collapsed.y,
        outerAnimation: sectionCollapseAnimation,
        innerAnimation: sectionCollapseContentsAnimation
      });
    }
    
    // Create unique Animation names, useful for multiple section patterns
    this._createAnimationsNames();
    
    sectionEase.textContent += `
    @keyframes ${this._sectionExpandAnimationName} {
      ${sectionExpandAnimation.join('')}
    }

    @keyframes ${this._sectionExpandContentsAnimationName} {
      ${sectionExpandContentsAnimation.join('')}
    }

    @keyframes ${this._sectionCollapseAnimationName} {
      ${sectionCollapseAnimation.join('')}
    }

    @keyframes ${this._sectionCollapseContentsAnimationName} {
      ${sectionCollapseContentsAnimation.join('')}
    }`;

    document.head.appendChild(sectionEase);
    return sectionEase;
  }

  _append ({
        percentage,
        step,
        startY,
        endY,
        outerAnimation,
        innerAnimation}=opts) {

  
    var yScale = (startY + (endY - startY) * step).toFixed(5);

    var invScaleY = (1 / yScale).toFixed(5);

    outerAnimation.push(`
      ${percentage}% {
        transform: scaleY(${yScale});
      }`);

    innerAnimation.push(`
      ${percentage}% {
        transform: scaleY(${invScaleY});
      }`);
  }

  _createAnimationsNames () {
    
    this._sectionExpandAnimationName = "sectionExpandAnimation" + this._index;
    this._sectionExpandContentsAnimationName = "sectionExpandContentsAnimation" + this._index;
    this._sectionCollapseAnimationName = "sectionCollapseAnimation" + this._index;
    this._sectionCollapseContentsAnimationName = "sectionCollapseContentsAnimation" + this._index;
    
    // Create CSS Var of each animation
    this._section.style.setProperty('--sectionExpandAnimation', this._sectionExpandAnimationName);
    this._section.style.setProperty('--sectionExpandContentsAnimation', this._sectionExpandContentsAnimationName);
    this._section.style.setProperty('--sectionCollapseAnimation', this._sectionCollapseAnimationName);
    this._section.style.setProperty('--sectionCollapseContentsAnimation', this._sectionCollapseContentsAnimationName);
  }

  _clamp (value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  _ease (v, pow=4) {
    v = this._clamp(v, 0, 1);

    return 1 - Math.pow(1 - v, pow);
  }
}

var sections = document.querySelectorAll('.section');
var currentsection;

for(var i = 0; i < sections.length; i++){
 currentsection = sections[i];
 new section(currentsection, i); 
}



