'use strict';

import { PubSub } from './pub-sub';

export class PubSubState extends PubSub {
    #data;

    constructor(data) {
        super();
        this.#data = data;
    }

    get value() {
        return this.#data;
    }

    next(data) {
        this.#data = data;
        this.publish(data);
    }

    subscribe(callback) {
        callback(this.#data);
        return super.subscribe(callback);
    }
}