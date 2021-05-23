'use strict';
import { GameType, GameMode } from 'GAME_ENUMS';
import { GameWizardVS } from '../game-wizard-vs';
import { User } from '~/_models/user';
import { STEPS } from '../game-wizard-vs.constants';
export class GameWizardVSBot extends GameWizardVS {

    constructor(onPlay, onClose) {
        super(onPlay, onClose);
        this.type = GameType.Bot;


        this.mode = GameMode.Clear;
        this.baseSteps.unshift(STEPS.bot);

        this.opponent = new User('MineweeperBot');

        
        

        console.log('GameWizardVSBot');
        

        
        this.setConfig();
    }

}
