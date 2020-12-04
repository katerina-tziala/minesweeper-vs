"use strict";
import { Game } from "./game";

export class GameSinglePlayer extends Game {

  constructor(id, params, player) {
    super(id, params, player);
  }

  init() {
    super.init();
    this.player.initState();
    this.player.turn = true;
  }













}
