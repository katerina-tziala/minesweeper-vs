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


// import './app/game/game-board/GameBoard';
import './app/game/game-board-original/GameBoardOriginal';

//  const loadStyles = () => import("./index.scss");

document.addEventListener('DOMContentLoaded', () => {



  PageLoaderHandler.hide();
  //
  // new App();
  const userService = AppUserService.getInstance();

  const player = { id: userService.id, name: userService.username };
  const playerStyles = userService.getPlayerConfig(player.id);
  player.styles = playerStyles;


  const gameStyles = userService.gameStyles;
  gameStyles.flagTypes = playerStyles.flagType;
  gameStyles.flagColors = `type-${playerStyles.colorType}`;
  

  // console.log(player);
  // console.log(playerStyles);
  // console.log(gameStyles);
  const level = { level: "beginner", rows: 9, columns: 9, numberOfMines: 16 };
  const { rows, columns, numberOfMines } = { level };

  const options = {
    marks: true,
    misplacedFlagHint: true
  };

  const config = { level, options, gameStyles };
  const board = document.getElementsByTagName('app-game-board-original')[0];
  board.init(config, player);
  board.start(config)
  //console.log(config);
  // rows="9"
  // columns="9"
  // disabled="false"
  // revealing="true"
  // flagging="true"
  // wrong-flag-hint="true"
  // theme="light"
  // mine-type="biohazard"



  // const options = {
  //   flagging: true,
  //   marks: true,
  //   misplacedFlagHint: false,
  //   openStrategy: true,
  //   sneakPeek: false,
  //   sneakPeekDuration: 0,
  //   unlimitedFlags: true
  // }
  // const turns = {
  //   consecutiveTurns: true,
  //   missedTurnsLimit: 10,
  //   turnDuration: 5,
  //   turnTimer: true
  // }
  //   const level = { level: "beginner", rows: 9, columns: 9, numberOfMines: 16 };
  //   // const minesPositions = generateMinesPositions(level.rows, level.columns, level.numberOfMines);
  //   ///const minesPositions = [9, 14, 15, 18, 22, 25, 27, 34, 49, 53, 58, 63, 64, 70, 71, 72];
  //   //console.log(minesPositions);
  //   const minesPositions = [1, 2, 3, 80, 81];
  //   //const minesCounter = document.getElementsByTagName('app-digital-counter')[0];
  //   // const minesCounter = document.getElementsByTagName('app-flags-counter')[0];


  //   const minefield = document.getElementsByTagName('app-minefield')[0];
  //   const gameTimer = document.getElementsByTagName('app-game-timer')[0];

  //  // gameTimer.start();
  //   gameTimer.addEventListener('onTurnEnd', (event) => {
  //     console.log('onTurnEnd');
  //   });


 
  //   setTimeout(() => {
  //     minefield.init(minesPositions);
  //     // minefield.disabledPositions = [1, 3, 4, 5, 6, 8, 9];
  //   }, 500);

  // setTimeout(() => {
  //   // const styles = userService.getPlayerConfig('dfgdfg');
  //   // boardFace.setAttribute('color', '#0000ff');
  //   // console.log(styles);
  //   // console.log('ddd');
  //   minesCounter.setValue(-5);
  //   // const test = document.querySelectorAll('[theme="light"]');
  //   // console.log(test);
  //   // minefield.disabledPositions = [1, 3, 4, 5, 6, 8, 9];
  // }, 3000);


  // setTimeout(() => {
  //   minefield.setAttribute('theme', 'dark');
  //   minefield.setAttribute('mine-type', 'virusMine');
  //   // minefield.disabledPositions = [1, 3, 4, 5, 6, 8, 9];
  // }, 1500);
  
  // setTimeout(() => {
  //   minefield.setAttribute('disabled', true);
  //   console.log('disabled'); 
  // }, 3000);
  // setTimeout(() => {
  //   minefield.setAttribute('disabled', false);
  //   console.log('en'); 
  // }, 5000);

  // PageLoaderHandler.hide();


});
// window.onhashchange = this.locationHashChanged.bind(this);
// locationHashChanged(event) {
//   console.log(event);
//   if (location.hash === '#cool-feature') {
//     console.log("You're visiting a cool feature!");
//   }
// }




