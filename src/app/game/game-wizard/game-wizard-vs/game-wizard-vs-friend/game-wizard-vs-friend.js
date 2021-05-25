'use strict';
import { GameType } from 'GAME_ENUMS';
import { GameWizardVS } from '../game-wizard-vs';
import { User } from '~/_models/user';

export class GameWizardVSFriend extends GameWizardVS {

    constructor(onComplete, onClose) {
        super(onComplete, onClose, new User('local friend'));
        this.type = GameType.Friend;
        //this.opponent = new User('local friend');

        
        this.setConfig();
    }

}
