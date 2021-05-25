'use strict';
import { GameType } from 'GAME_ENUMS';
import { GameWizardVS } from '../game-wizard-vs';
import { WizardSteps } from '../wizard-steps.enum';

export class GameWizardVSBot extends GameWizardVS {

    constructor(onComplete, onClose) {
        super(onComplete, onClose, { id: 'bot', username: 'MineweeperBot' });
        this.type = GameType.Bot;
        this.setConfig();
        this.setHeaderText();
    }

    get gameSetup() {
        let gameSettings = super.gameSetup;
        if (gameSettings) {
            const { bot, opponent, ...settings } = gameSettings;
            opponent.level = bot.botLevel;
            settings.opponent = opponent;
            gameSettings = settings;
        }
        return gameSettings;
    }

    setConfig() {
        super.setConfig();
        this.baseSteps.unshift(WizardSteps.Bot);
    }
}
