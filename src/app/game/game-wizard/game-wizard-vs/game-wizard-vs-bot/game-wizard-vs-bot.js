'use strict';
import { GameType, GameMode } from 'GAME_ENUMS';
import { GameWizardVS } from '../game-wizard-vs';
import { User } from '~/_models/user';
import { WizardSteps } from '../wizard-steps.enum';

export class GameWizardVSBot extends GameWizardVS {

    constructor(onPlay, onClose) {
        super(onPlay, onClose);

        this.opponent = new User('MineweeperBot');
        this.setConfig();
        this.setHeaderText();
    }

    setConfig() {
        super.setConfig();
        this.type = GameType.Bot;
        this.mode = GameMode.Clear;
        this.baseSteps.unshift(WizardSteps.Bot);
    }
}
