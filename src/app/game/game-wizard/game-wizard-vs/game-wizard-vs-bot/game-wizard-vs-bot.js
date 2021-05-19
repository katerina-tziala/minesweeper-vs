'use strict';
import { GameType, GameMode } from 'GAME_ENUMS';
import { GameWizardVS } from '../game-wizard-vs';
import { User } from '~/_models/user';

export class GameWizardVSBot extends GameWizardVS {

    constructor(onPlay, onClose) {
        super(onPlay, onClose);
        this.type = GameType.Bot;
        this.opponent = new User('MineweeperBot');

        this.mode = GameMode.Clear;
        

        console.log('GameWizardVSBot');
        

        
        this.setConfig();
    }

}
