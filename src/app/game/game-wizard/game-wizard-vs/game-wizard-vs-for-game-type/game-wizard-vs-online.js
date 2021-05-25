'use strict';
import { GameType } from 'GAME_ENUMS';
import { GameWizardVS } from '../game-wizard-vs';
const FRIEND = { id: 'friend', username: 'A Friend' };
export class GameWizardVSOnline extends GameWizardVS {

    constructor(opponent = FRIEND) {
        super(opponent);
        this.type = GameType.Online;
        this.setConfig();
        this.setHeaderText();
    }

}
