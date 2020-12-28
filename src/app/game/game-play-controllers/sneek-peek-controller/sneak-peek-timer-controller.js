"use strict";

import { ElementHandler } from "HTML_DOM_Manager";
import { SneakPeekCounter } from "GamePlayComponents";
import { GameInterval } from "GamePlayControllers";

export class SneakPeekTimerController extends GameInterval {
  #_parentElementId;
  #_counterColorType;

  constructor(initialValue, onEnd) {
    super();
    this.limit = 0;
    this.step = -1;
    this.initialValue = initialValue;
    this.onEnd = onEnd;
  }

  set parentElementID(elementId) {
    console.log(elementId);
    this.#_parentElementId = elementId;
  }

  get #parentElementID() {
    return this.#_parentElementId;
  }

  get #counterParent() {
    return ElementHandler.getByID(this.#parentElementID);
  }

  set counterColorType(type) {
    this.#_counterColorType = type;
  }

  get counterColorType() {
    return this.#_counterColorType;
  }

  startCountdown(colorType) {
    this.counterColorType = colorType;
    this.stop();
    return this.#counterParent.then((container) => {
      container.append(SneakPeekCounter.generate);
      ElementHandler.display(container);
      this.start();
      return;
    });
  }

  stopCountDown() {
    this.stop();
    return this.#counterParent.then((container) => {
      ElementHandler.clearContent(container);
      ElementHandler.hide(container);
      return;
    });
  }

  onInit() {
    SneakPeekCounter.updateValue(this.value, this.counterColorType)
      .then(() => {
        return;
      })
      .catch(() => {
        this.submitEnd();
      });
  }

  onUpdate() {
    SneakPeekCounter.updateValue(this.value, this.counterColorType)
      .then(() => {
        return;
      })
      .catch(() => {
        this.submitEnd();
      });
  }
}
