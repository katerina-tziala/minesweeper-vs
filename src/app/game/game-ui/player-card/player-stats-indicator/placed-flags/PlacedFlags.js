'use strict';
import './placed-flags.scss';
import { NumberValidation } from 'UTILS';
import { ElementHandler } from 'UI_ELEMENTS';
import { TEMPLATES, DOM_ELEMENT_CLASS } from './placed-flags.constants';
import PlayerStatsIndicator from '../PlayerStatsIndicator';

export default class PlacedFlags extends PlayerStatsIndicator {

  constructor() {
    super();
  }

  setIndicatorValue() {
    const infinite = !NumberValidation.numberDefined(this.value);
    this.setIndicatorStyles();
    infinite ? this.#setInfinite() : this.#setNumber();
  }

  #setInfinite() {
    this.indicator.innerHTML = TEMPLATES.infinite;
  }

  #setNumber() {
    const value = NumberValidation.numberFromString(this.value);
    this.indicator.innerHTML = value;

    ElementHandler.addStyleClass(this.indicator, DOM_ELEMENT_CLASS.flagsNumber);
    if (NumberValidation.numberFromString(value) < 2) {
      ElementHandler.addStyleClass(this.indicator, `${DOM_ELEMENT_CLASS.flagsNumber}--${value}`);
    }
  }

}

customElements.define('app-placed-flags', PlacedFlags);