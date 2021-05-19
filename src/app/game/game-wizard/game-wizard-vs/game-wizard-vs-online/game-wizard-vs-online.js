'use strict';
import { GameType, GameMode } from 'GAME_ENUMS';
import { GameWizardVS } from '../game-wizard-vs';
import { User } from '~/_models/user';

export class GameWizardVSOnline extends GameWizardVS {

    constructor(onPlay, onClose) {
        super(onPlay, onClose);
        console.log('GameWizardVSOnline');

        this.type = GameType.Online;
        this.opponent = new User('A Friend');

        this.mode = GameMode.Clear;
        this.setConfig();
    }

}
