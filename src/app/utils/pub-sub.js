'use strict';

export class PubSub {
    #subscribers = [];

    publish(data) {
        this.#subscribers.forEach(subscriberCallback => subscriberCallback(data));
    }

    subscribe(callback) {
        this.#subscribers.push(callback);
    
        const index = this.#subscribers.length - 1;
        const unsubscribe = () => this.#subscribers.splice(index, 1);

        return { unsubscribe };
    }

}