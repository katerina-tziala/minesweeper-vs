'use strict';
import { GameType } from 'GAME_ENUMS';
import { GameWizardVS } from '../game-wizard-vs';
import { WizardSteps } from '../wizard-steps.enum';

const BOT = { id: 'bot', username: 'MineweeperBot' };

export class GameWizardVSBot extends GameWizardVS {

    constructor(onComplete, onClose) {
        super(BOT, onComplete, onClose);
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
