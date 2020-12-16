"use strict";

import { LocalStorageHelper } from "~/_utils/local-storage-helper";

import { GameType, GameVSMode } from "GameEnums";
import { LevelSettings, TurnSettings, Player, BotPlayer } from "GameModels";

export class GameFactory {

  static getGameModelParams(gameParams) {
    gameParams.levelSettings = GameFactory.getLevelSettings(gameParams.levelSettings);

    if (gameParams.turnSettings) {
      const turnSettings = new TurnSettings();
      turnSettings.update(gameParams.turnSettings)
      gameParams.turnSettings = turnSettings;
    }

    return gameParams;
  }

  static loadGame(gameParams, gameId) {
    gameParams = GameFactory.getGameModelParams(gameParams);
 
    const playersData = gameParams.players;
    delete gameParams.players;

    switch (gameParams.type) {
      case GameType.Original:
        return GameFactory.loadPlayerGame(gameId, gameParams);
      case GameType.Friend:
        return GameFactory.loadGameVs(gameId, gameParams, GameFactory.getOpponent(playersData));
      case GameType.Bot:
        return GameFactory.loadGameVSBot(gameId, gameParams, playersData);
      case GameType.Online:
        return GameFactory.loadGameVSOnline(gameId, gameParams, playersData);
      default:
        return undefined;
    }
  }

  static getLevelSettings(settings) {
    const levelSettings = new LevelSettings();
    levelSettings.update(settings);
    return levelSettings;
  }

  static getPlayer() {
    const player = new Player(self.user.id, self.user.username);
    player.colorType = LocalStorageHelper.appSettings.playerColorType;
    return player;
  }

  static getOpponentData(players) {
    return players.find((player) => player.id !== self.user.id);
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

  static isParallelGaming(gameParams) {
    return gameParams.optionsSettings.vsMode === GameVSMode.Parallel;
  }

  static isVSModeDetect(gameParams) {
    return gameParams.optionsSettings.vsMode === GameVSMode.Detect;
  }

  static loadGameVSBot(gameId, gameParams, playersData) {
    const botPlayer = GameFactory.getBot(playersData);
    if (GameFactory.isParallelGaming(gameParams)) {
      return GameFactory.loadParrallelGame(gameId, gameParams, botPlayer);
    }
    return GameFactory.loadGameVs(gameId, gameParams, botPlayer);
  }

  static loadGameVSOnline(gameId, gameParams, playersData) {
    const opponent = GameFactory.getOpponent(playersData);
    if (GameFactory.isParallelGaming(gameParams)) {
      return GameFactory.loadParrallelGame(gameId, gameParams, opponent);
    }
    return GameFactory.loadGameVs(gameId, gameParams, opponent);
  }

  static loadPlayerGame(gameId, gameParams, player = GameFactory.getPlayer()) {
    return import(`GamePlayType`).then((module) => {
      return new module.GameSinglePlayer(gameId, gameParams, player);
    });
  }

  static loadGameVs(gameId, gameParams, opponent) {
    return import(`GamePlayType`).then((module) => {
      if (GameFactory.isVSModeDetect(gameParams)) {
        return new module.GameVSDetect(
          gameId,
          gameParams,
          GameFactory.getPlayer(),
          opponent,
        );
      }
      return new module.GameVSClear(
        gameId,
        gameParams,
        GameFactory.getPlayer(),
        opponent,
      );
    });
  }

  static loadParrallelGame(gameId, gameParams, opponent) {
    const player = GameFactory.getPlayer();
    const gamesForPlayers = [
      GameFactory.loadPlayerGame(player.id, gameParams, player),
      GameFactory.loadPlayerGame(opponent.id, gameParams, opponent),
    ];
    return Promise.all(gamesForPlayers).then(([playerGame, opponentGame]) => {
      return import(`GamePlayType`).then((module) => {
        return new module.GameParallel(gameId, playerGame, opponentGame);
      });
    });
  }
}
