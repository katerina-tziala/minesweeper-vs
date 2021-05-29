'use strict';
import { LocalStorageHelper } from 'UTILS';

export default class AppUserService {
    #id = 'minesweeperUser';
    #username;
    #inGame = false;
    #joinedAt;
    #peers = [];

    constructor() {
        this.#username = LocalStorageHelper.username;
        console.log('AppUser');
        console.log(this.#username);
    }

    static getInstance() {
        if (!AppUserService.instance) {
            AppUserService.instance = new AppUserService;
        }
        return AppUserService.instance;
    }

    get username() {
        return this.#username;
    }

    set username(username) {
        this.#username = username;
       // LocalStorageHelper.saveUsername(this.#username);
    }

    onConnected({ user, peers }) {
        const { id, inGame, joinedAt, username } = user;
        this.username = username;
        this.#id = id;
        this.#inGame = inGame;
        this.#joinedAt = joinedAt;
        this.#peers = peers;
    }

}