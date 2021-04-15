class Avatar extends HTMLElement {

  // // A getter/setter for an open property.
  // get open() {
  //   return this.hasAttribute('open');
  // }

  // set open(val) {
  //   // Reflect the value of the open property as an HTML attribute.
  //   if (val) {
  //     this.setAttribute('open', '');
  //   } else {
  //     this.removeAttribute('open');
  //   }
  //   this.toggleDrawer();
  // }

  // // A getter/setter for a disabled property.
  // get disabled() {
  //   return this.hasAttribute('disabled');
  // }

  // set disabled(val) {
  //   // Reflect the value of the disabled property as an HTML attribute.
  //   if (val) {
  //     this.setAttribute('disabled', '');
  //   } else {
  //     this.removeAttribute('disabled');
  //   }
  // }
  static get observedAttributes() {
    return ["type"];
  }
  // Can define constructor arguments if you wish.
  constructor() {
    super();
  console.log("Avatar");
    // Setup a click listener on <app-drawer> itself.
    // this.addEventListener('click', e => {
    //   // Don't toggle the drawer if it's disabled.
    //   if (this.disabled) {
    //     return;
    //   }
    //   this.toggleDrawer();
    // });

    const type = this.getAttribute("type");

    console.log(type);

    this.classList.add(`avatar-${type}`)
  }

  connectedCallback() {
    console.log("connectedCallback");
  }

  disconnectedCallback() {
    console.log("disconnectedCallback");
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    console.log("attributeChangedCallback");
    console.log(attrName, oldVal, newVal);
    this.classList.add(`avatar-${newVal}`)
  }

  adoptedCallback(attrName, oldVal, newVal) {
    console.log("adoptedCallback");
  }

}

customElements.define("app-avatar", Avatar);