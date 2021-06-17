'use strict';
import { LocalStorageHelper } from 'UTILS';

export default class AppUserService {
    #id = 'minesweeperUser';
    #username;
    #inGame = false;
    #joinedAt;

    #appSettings = {
        theme: 'light',
        mineType: 'virusMine',
        userConfig: {
            flagType: 'awesomeFlag',
            colorType: '1'
        },
        opponentConfig: {
            flagType: 'checkeredFlag',
            colorType: '2'
        }
    }


    constructor() {
        this.#username = 'kate';
        //this.#username = LocalStorageHelper.username;
        // console.log('AppUser');
        // console.log(this.#username);
    }

    static getInstance() {
        if (!AppUserService.instance) {
            AppUserService.instance = new AppUserService;
        }
        return AppUserService.instance;
    }

    get theme() {
        return this.#appSettings.theme;
    }

    get mineType() {
        return this.#appSettings.mineType;
    }

    getPlayerConfig(id) {
        if (id !== this.#id) {
            return this.#appSettings.opponentConfig;
        }
        return this.#appSettings.userConfig;
    } 

    get id() {
        return this.#id;
    }
    
    get username() {
        return this.#username;
    }

    set joinedAt(joinedAt) {
        this.#joinedAt = joinedAt;
    }

    set username(username) {
        this.#username = username;
        // LocalStorageHelper.saveUsername(this.#username);
    }

    onConnected(user) {
        const { id, inGame, joinedAt, username } = user;
        this.username = username;
        this.#id = id;
        this.#inGame = inGame;
        this.#joinedAt = joinedAt;
    }

}