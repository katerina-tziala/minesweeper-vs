"use strict";

import { LocalStorageHelper } from "~/_utils/local-storage-helper";
import { clone } from "~/_utils/utils.js";

import { GameType, GameVSMode } from "GameEnums";
import { LevelSettings, OptionsSettings, TurnSettings, Player, BotPlayer } from "GameModels";

export class GameFactory {

  static getGameModelParams(gameParams) {
    gameParams = clone(gameParams);
    gameParams.levelSettings = GameFactory.getLevelSettings(gameParams.levelSettings);
    gameParams.optionsSettings = GameFactory.getOptionsSettings(gameParams.optionsSettings);

    if (gameParams.turnSettings) {
      const turnSettings = new TurnSettings();
      turnSettings.update(gameParams.turnSettings);
      gameParams.turnSettings = turnSettings;
    }

    return gameParams;
  }

  static getLevelSettings(settingsData) {
    const settings = new LevelSettings();
    settings.update(settingsData);
    return settings;
  }

  static getOptionsSettings(settingsData) {
    const settings = new OptionsSettings();
    settings.update(settingsData);
    return settings;
  }

  static loadGame(gameParams, gameId) {
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

  static getPlayer() {
    const player = new Player(self.user.id, self.user.username, true);
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
    gameParams = GameFactory.getGameModelParams(gameParams);
 
    return import("GamePlayType").then((module) => {
      return new module.GameSinglePlayer(gameId, gameParams, player);
    });
  }

  static loadGameVs(gameId, gameParams, opponent) {
    gameParams = GameFactory.getGameModelParams(gameParams);
 
    return import("GamePlayType").then((module) => {
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

  static parallelGameOptions(gameParams) {
    const parallelOptions = clone(gameParams.optionsSettings);
    delete parallelOptions.marks;
    delete parallelOptions.wrongFlagHint;
    delete parallelOptions.vsMode;

    return {
      optionsSettings: parallelOptions,
      type: gameParams.type
    };
  }

  static parallelGamingOptions(gameParams) {
    const parallelGame = GameFactory.parallelGameOptions(gameParams);
    const playerGame = {
      marks: gameParams.optionsSettings.marks,
      wrongFlagHint: gameParams.optionsSettings.wrongFlagHint,
      vsMode: gameParams.optionsSettings.vsMode
    };
    return {parallelGame, playerGame};
  }

  static loadParrallelGame(gameId, gameParams, opponent) {
    const player = GameFactory.getPlayer();

    const gamingOptions = GameFactory.parallelGamingOptions(gameParams);
    gameParams.optionsSettings = gamingOptions.playerGame;
    gameParams.turnSettings = new TurnSettings(false);

    const gamesForPlayers = [
      GameFactory.loadPlayerGame(player.id, gameParams, player),
      GameFactory.loadPlayerGame(opponent.id, gameParams, opponent),
    ];

    return Promise.all(gamesForPlayers).then(([playerGame, opponentGame]) => {
      return import("GamePlayType").then((module) => {
        return new module.GameParallel(gameId, gamingOptions.parallelGame, playerGame, opponentGame);
      });
    });
  }
}
