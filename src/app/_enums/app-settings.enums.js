"use strict";

const Theme = {
  Default: "light",
  Dark: "dark",
};
Object.freeze(Theme);

const MineType = {
  Bomb: "bomb",
  Bahai: "bahai",
  Virus: "virus",
};
Object.freeze(MineType);

const SettingType = {
  Theme: "theme",
  MineType: "mineType",
  PlayerColorType: "playerColorType",
  OpponentColorType: "opponentColorType",
};
Object.freeze(SettingType);

export { Theme, MineType, SettingType };
