'use strict';
import { DATES, uniqueArrayValues, secondsToTimeObject } from 'UTILS';

export default class GameRound {
  #startedAt = null;
  #endedAt = null;
  #roundTiles;

  get duration() {
    const seconds = DATES.dateDifferenceInSeconds(this.#endedAt, this.#startedAt);
    return secondsToTimeObject(seconds);
  }

  get results() {
    const results = {
      startedAt: this.#startedAt,
      endedAt: this.#endedAt,
      duration: this.duration
    };
    for (const [key, tiles] of this.#roundTiles) {
      results[key] = tiles;
    }
    return results;
  }

  init() {
    this.#startedAt = DATES.nowTimestamp();
    this.#endedAt = null;
    this.#roundTiles = new Map();
  }

  update(tilesIndex = {}) {
    Object.keys(tilesIndex).forEach(key => {
      const existingTiles = this.#getRoundTiles(key);
      const newTiles = [...tilesIndex[key], ...existingTiles];
      this.#roundTiles.set(key, uniqueArrayValues(newTiles));
    });
  }
  
  onRoundEnd(tilesIndex = {}) {
    this.#endedAt = DATES.nowTimestamp();
    this.update(tilesIndex);
    return this.results;
  }

  #getRoundTiles(key) {
    return this.#roundTiles.get(key) || [];
  }

}
