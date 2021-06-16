'use strict';
import { STYLES_CONFIG } from './minefield-ui/minefield-ui-config/minefield-ui.constants';
import { MinefieldAction } from './minefield-action.enum';
import { PubSub } from 'UTILS';
const DEBOUNCE_TIME = 80;
const TILE_SIZE = STYLES_CONFIG.tileSize;

export default class MinefieldEventsHandler {
  #primaryListeners;
  #secondaryListeners;
  #moveTimer;
  selectedFieldPosition$ = new PubSub();
  resetRevealedArea$ = new PubSub();
  activeTile$ = new PubSub();
  activeArea$ = new PubSub();
  #action;
  #gridPosition;
  #columns;
  #rows;

  constructor(columns, rows) {
    this.#columns = columns;
    this.#rows = rows;
    this.#primaryListeners = new Map();
    this.#primaryListeners.set('contextmenu', this.#preventDefaultAction.bind(this));
    this.#primaryListeners.set('mousedown', this.#onMouseDown.bind(this));
    this.#primaryListeners.set('mouseleave', this.#onMouseLeave.bind(this));
    this.#primaryListeners.set('mouseenter', this.#onMouseEnter.bind(this));
    this.#secondaryListeners = new Map();
    this.#secondaryListeners.set('mouseup', this.#onMouseUp.bind(this));
    this.#secondaryListeners.set('mousemove', this.#onMouseMove.bind(this));
  }
  get #selectedPosition() {
    if (!this.#gridPosition) {
      return 0;
    }
    const { row, column } = this.#gridPosition;
    return (row - 1) * this.#columns + column;
  }

  setListeners(canvas) {
    this.#setFieldListeners(canvas, this.#primaryListeners);
  }

  removeListeners(canvas) {
    this.#removeFieldListeners(canvas, this.#primaryListeners);
    this.#removeSecondaryListeners(canvas);
  }

  #initParams() {
    this.#action = undefined;
    this.#gridPosition = undefined;
  }

  #preventDefaultAction(event) {
    event.stopImmediatePropagation();
    event.preventDefault();
    event.stopPropagation();
  }

  #onMouseDown(event) {
    this.#preventDefaultAction(event);
    this.#action = event.buttons.toString();
    this.#gridPosition = this.#getGridPosition(event);
    this.#onActivateGridArea();
    this.#setFieldListeners(event.target, this.#secondaryListeners);
  }

  #onMouseLeave(event) {
    this.#preventDefaultAction(event);
    if (this.#gridPosition) {
      const position = this.#selectedPosition;
      this.resetRevealedArea$.publish(position);
    }
    if (!event.buttons) {
      this.#initParams();
      this.#removeSecondaryListeners(event.target);
    }
  }

  #onMouseEnter(event) {
    this.#preventDefaultAction(event);
    if (!event.buttons) {
      this.#initParams();
      this.#removeSecondaryListeners(event.target);
      return;
    }
    this.#onMouseDown(event);
  }

  #onMouseUp(event) {
    this.#preventDefaultAction(event);
    this.#removeSecondaryListeners(event.target);

    if (!this.#action || !this.#gridPosition) {
      return;
    }
    const position = this.#selectedPosition;

    if (this.#action === MinefieldAction.Neighbors) {
      this.resetRevealedArea$.publish(position);
    } else {
      const params = { position };
      params.action = this.#action;
      this.selectedFieldPosition$.publish(params);
    }
    this.#initParams();
  }

  #onMouseMove(event) {
    event.preventDefault();
    clearTimeout(this.#moveTimer);
    if (!this.#action) {
      return;
    }
    this.#moveTimer = setTimeout(() => { this.#handleMouseMove(event) }, DEBOUNCE_TIME);
  }

  #handleMouseMove(event) {
    if (!this.#action) {
      clearTimeout(this.#moveTimer);
      return;
    }
    const { row, column } = this.#getGridPosition(event);
    const changed = this.#gridPosition ? (this.#gridPosition.row !== row || this.#gridPosition.column !== column) : false;
    if (changed) {
      this.#gridPosition = { row, column };
      this.#onActivateGridArea();
    }
  }

  #onActivateGridArea() {
    const position = this.#selectedPosition;
    if (this.#action === MinefieldAction.Neighbors) {
      this.activeArea$.publish(position);
    } else {
      this.activeTile$.publish(position);
    }
  }

  #setFieldListeners(canvas, listeners) {
    for (const [listenerName, action] of listeners) {
      canvas.addEventListener(listenerName, action);
    }
  }

  #removeFieldListeners(canvas, listeners) {
    for (const [listenerName, action] of listeners) {
      canvas.removeEventListener(listenerName, action);
    }
  }

  #removeSecondaryListeners(canvas) {
    clearTimeout(this.#moveTimer);
    this.#removeFieldListeners(canvas, this.#secondaryListeners);
  }

  #getGridPosition(event) {
    const { x, y } = this.#getCoordinatesOnCanvas(event);
    let row = Math.ceil(y / TILE_SIZE);
    row = this.#validGridPosition(row, this.#rows);
    let column = Math.ceil(x / TILE_SIZE);
    column = this.#validGridPosition(column, this.#columns);
    return { row, column };
  }

  #validGridPosition(position, maxValue) {
    if (position > maxValue) {
      return maxValue;
    }
    return position < 1 ? 1 : position;
  }

  #getCoordinatesOnCanvas(event) {
    const { clientX, clientY } = event;
    const { left, top } = event.target.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;
    return { x, y };
  }

}
