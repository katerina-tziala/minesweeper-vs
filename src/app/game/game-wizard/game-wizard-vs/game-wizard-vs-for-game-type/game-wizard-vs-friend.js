'use strict';
import { GameMode, GameType } from 'GAME_ENUMS';
import { GameWizardVS } from '../game-wizard-vs';

export class GameWizardVSFriend extends GameWizardVS {

    constructor(opponent) {
        super(opponent);
        this.type = GameType.Friend;
        this.setConfig();
        this.setHeaderText();
    }

    updateMode(selectedMode = GameMode.Clear) {
        if (this.mode === selectedMode) {
            return;
        }
        this.mode = selectedMode;
    }
}
