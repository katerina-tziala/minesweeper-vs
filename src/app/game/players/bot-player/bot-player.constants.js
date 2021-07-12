"use strict";

import { GameAction } from "GameEnums";

export const LEVEL_ACTIONS = {
  easy: [
    {
      action: GameAction.Mark,
      selectionRange: [0, 0.5]
    },
    {
      action: GameAction.Reveal,
      selectionRange: [0.5, 1]
    }
  ],
  medium: [
    {
      action: GameAction.Target,
      selectionRange: [0, 0.5]
    },
    {
      action: GameAction.Mark,
      selectionRange: [0.5, 0.75]
    },
    {
      action: GameAction.Reveal,
      selectionRange: [0.75, 1]
    }
  ],
  hard: [
    {
      action: GameAction.Target,
      selectionRange: [0, 0.75]
    },
    {
      action: GameAction.Mark,
      selectionRange: [0.75, 0.825]
    },
    {
      action: GameAction.Reveal,
      selectionRange: [0.825, 1]
    }
  ],
  evil: [
    {
      action: GameAction.Target,
      selectionRange: [0, 1]
    },
  ]
};

export const MISS_TURNS = {
  easy: [0, 0.5],
  medium: [0, 0.25],
  hard: [0, 0.125],
  evil: [1, 1]
};

export const MOVE_DURATIONS = {
  easy: [1500, 2500],
  medium: [1000, 2000],
  hard: [500, 1500],
  evil: [0, 1000]
};

export const BOT_NAME = {
  easy: "Bot (Naive)",
  medium: "Bot (Intelligent)",
  hard: "Bot (Smart)",
  evil: "Bot (Genius)"
};
