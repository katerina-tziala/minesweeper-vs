"use strict";

import { LocalStorageHelper } from "~/_utils/local-storage-helper";

import { GameType, GameVSMode } from "GameEnums";
import { LevelSettings, Player, BotPlayer } from "GameModels";

import { GameSinglePlayer, GameVS, GameParallel } from "GamePlayType";
export class GameFactory {

  static getGame(gameParams, gameId) {
    gameParams.levelSettings = GameFactory.getLevelSettings(gameParams.levelSettings);

    const playersData = gameParams.players;
    delete gameParams.players;

    switch (gameParams.type) {
      case GameType.Original:
        return GameFactory.getPlayerGame(gameId, gameParams);
      case GameType.Friend:
        return new GameVS(gameId, gameParams, GameFactory.getPlayer(), GameFactory.getOpponent(playersData));
      case GameType.Bot:
        return GameFactory.getGameVSBot(gameId, gameParams, playersData);
      case GameType.Online:
        return GameFactory.getGameVSOnline(gameId, gameParams, playersData);
      default:
        return undefined;
    }
  }

  // #initializeWizard(gameId, gameParams, gameName = GameVS) {
  //   const gameName = `GameSetup${enumKey(GameType, this.#_gameType)}`;
  //   return import(`GamePlayType`).then(module => {
  //     return new module[wizardName](this.navigateToHome, this.onPlayGame.bind(this));
  //   });
  // }

  static getLevelSettings(settings) {
    const levelSettings = new LevelSettings();
    levelSettings.update(settings)
    return levelSettings;
  }

  static getPlayer() {
    const player = new Player(self.user.id, self.user.username);
    player.colorType = LocalStorageHelper.appSettings.playerColorType;
    return player;
  }

  static getOpponentData(players) {
    return players.find(player => player.id !== self.user.id);
  }

  static getOpponent(players) {
    const opponentData = this.getOpponentData(players);
    const opponent = new Player(opponentData.id, opponentData.name);
    opponent.colorType = LocalStorageHelper.appSettings.opponentColorType;
    return opponent;
  }

  static getBot(players) {
    const botPlayer = new BotPlayer();
    botPlayer.update(this.getOpponentData(players));
    botPlayer.colorType = LocalStorageHelper.appSettings.opponentColorType;
    return botPlayer;
  }

  static getPlayerGame(gameId, gameParams) {
    return new GameSinglePlayer(gameId, gameParams, GameFactory.getPlayer());
  }

  static getPlayerParallelGame(gameParams, player = GameFactory.getPlayer()) {
    return new GameSinglePlayer(player.id, gameParams, player);
  }

  static getGameVSBot(gameId, gameParams, playersData) {
    const botPlayer = GameFactory.getBot(playersData);
    if (gameParams.optionsSettings.vsMode === GameVSMode.Parallel) {
      const opponentGame = GameFactory.getPlayerParallelGame(gameParams, botPlayer);
      return new GameParallel(gameId, GameFactory.getPlayerParallelGame(gameParams), opponentGame);
    }
    return new GameVS(gameId, gameParams, GameFactory.getPlayer(), botPlayer);
  }

  static getGameVSOnline(gameId, gameParams, playersData) {
    const opponent = GameFactory.getOpponent(playersData);
    if (gameParams.optionsSettings.vsMode === GameVSMode.Parallel) {
      const opponentGame = GameFactory.getPlayerParallelGame(gameParams, opponent);
      return new GameParallel(gameId, GameFactory.getPlayerParallelGame(gameParams), opponentGame);
    }
    return new GameVS(gameId, gameParams, GameFactory.getPlayer(), opponent);
  }

}