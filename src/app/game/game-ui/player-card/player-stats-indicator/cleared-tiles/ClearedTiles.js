'use strict';
import './cleared-tiles.scss';
import PlayerStatsIndicator from '../PlayerStatsIndicator';

export default class ClearedTiles extends PlayerStatsIndicator {
  constructor() {
    super();
  }
}

customElements.define('app-cleared-tiles', ClearedTiles);