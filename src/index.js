// import './app/ui-elements/custom-elements/@custom-elements.module';
import './index.scss';
import { App } from './app/App';
import * as PageLoaderHandler from './app/pages/page-loader-handler';
// import { LocalStorageHelper } from 'UTILS';

import './app/ui-elements/custom-elements/loader/Loader';

//will change to transform
// -- router guard
// on reload return to your state

import AppUserService from './app/state-controllers/app-user.service';


//import './app/game/game-ui/game-board/game-board-vs/GameBoardVS';
import './app/game/game-ui/game-board/game-board-original/GameBoardOriginal';
import './app/game/game-ui/game-board/game-board-vs/game-board-detect/GameBoardDetect';
import './app/game/game-ui/game-board/game-board-vs/game-board-clear/GameBoardClear';

// import './app/game/game-ui/player-card/PlayerCard';
import './app/game/game-ui/player-turns/PlayerTurns';

//  const loadStyles = () => import("./index.scss");
import { Player } from './app/game/players/player';
// window.onhashchange = this.locationHashChanged.bind(this);
// locationHashChanged(event) {
//   console.log(event);
//   if (location.hash === '#cool-feature') {
//     console.log("You're visiting a cool feature!");
//   }
// }

document.addEventListener('DOMContentLoaded', () => {

  PageLoaderHandler.hide();
  // new App();


  const userService = AppUserService.getInstance();

  const player = new Player(userService.id, userService.username);
  const playerStyles = userService.getPlayerConfig(player.id);
  player.styles = playerStyles;
  player.onTurn = true;
  console.log(player);


  const opponent = new Player('opponent', 'Angie' );
  const opponentStyles = userService.getPlayerConfig(opponent.id);
  opponent.styles = opponentStyles;
  opponent.onTurn = false;
  

  const gameStyles = userService.gameStyles;
  gameStyles.flagTypes = playerStyles.flagType + ',' + opponentStyles.flagType;
  gameStyles.flagColors = `${playerStyles.colorType},${opponentStyles.colorType}`;

  const tttt = document.getElementsByTagName('app-player-turns')[0];

  setTimeout(() => {
    tttt.setAttribute('missed-turns', 6);
    console.log('ooo');
  }, 2000)
  // testBoard(player, gameStyles);
});


function testBoard(player, gameStyles) {

  const level = { level: "beginner", rows: 9, columns: 9, numberOfMines: 16 };

  const options = {
    marks: true,
    misplacedFlagHint: false,
    flagging: true,
    revealing: true,
    unlimitedFlags: true,
    gameTimer: true,
    flagsCounterRight: false,
    openStrategy: true,
    sneakPeek: false,
    sneakPeekDuration: 0
  };

  const turns = {
    consecutiveTurns: true,
    missedTurnsLimit: 10,
    turnDuration: 0,
    turnTimer: true
  };
  const config = { ...level, ...options, ...turns, ...gameStyles };
  const board = document.getElementById('board');
  //console.log(board);
  board.init(config);
  board.start(player, [1, 2, 3, 4, 5, 6, 7, 80, 81])

  board.addEventListener('onMove', (event) => {
    console.log('onMove');
    console.log(event.detail);
  })
  board.addEventListener('onRoundEnd', (event) => {
    console.log('onRoundEnd');
    console.log(event.detail);
  })
  board.addEventListener('onGameEnd', (event) => {
    console.log('onGameEnd');
    console.log(event.detail);
  })

  board.addEventListener('onRestart', (event) => {
    console.log('onRestart');
    console.log(event.detail);
  })


}



