import './app/ui-elements/custom-elements/@custom-elements.module';
import './index.scss';
import { App } from './app/App';
import * as PageLoaderHandler from './app/pages/page-loader-handler';
import { LocalStorageHelper } from 'UTILS';
// import './styles/iconography/fontawesome/fontawesome.scss';
// import './styles/iconography/fontawesome/regular.scss';
// import './styles/iconography/fontawesome/solid.scss';

//will change to transform
// -- router guard
// on reload return to your state
import { PubSub, PubSubState } from 'UTILS';



import { generateMinesPositions } from './app/game/game-utils/game-utils';
import Minefield from './app/game/minefield/Minefield';






//  const loadStyles = () => import("./index.scss");
var tiles = [];
document.addEventListener('DOMContentLoaded', () => {



  PageLoaderHandler.hide();
  //new App();


  const level = { level: "beginner", rows: 9, columns: 9, numberOfMines: 16 };
  // const minesPositions = generateMinesPositions(level.rows, level.columns, level.numberOfMines);
  const minesPositions =  [9, 14, 15, 18, 22, 25, 27, 34, 49, 53, 58, 63, 64, 70, 71, 72];
  //console.log(minesPositions);


  const minefield = document.getElementsByTagName('app-minefield')[0];

  setTimeout(() => {
    minefield.init(minesPositions);  
  }, 500);
  // console.log(minefield);

  

  // PageLoaderHandler.hide();


});
// window.onhashchange = this.locationHashChanged.bind(this);
// locationHashChanged(event) {
//   console.log(event);
//   if (location.hash === '#cool-feature') {
//     console.log("You're visiting a cool feature!");
//   }
// }




function roundRect(ctx, area, radius = 5) {
  const { xStart, xEnd, yStart, yEnd } = area;

  //console.log(x, y);

  // ctx.shadowColor = "rgba(128, 128, 128, 1)";
  // ctx.shadowOffsetX = 0; 
  // ctx.shadowOffsetY = 0;
  // ctx.shadowOffsetY = 0;
  // ctx.shadowBlur = 8;
  //ctx.save();

  // ctx.save();


  ctx.beginPath();
  ctx.moveTo(xStart + radius, yStart);
  ctx.lineTo(xEnd - radius, yStart);
  ctx.quadraticCurveTo(xEnd, yStart, xEnd, yStart + radius);
  ctx.lineTo(xEnd, yEnd - radius);
  ctx.quadraticCurveTo(xEnd, yEnd, xEnd - radius, yEnd);
  ctx.lineTo(xStart + radius, yEnd);
  ctx.quadraticCurveTo(xStart, yEnd, xStart, yEnd - radius);
  ctx.lineTo(xStart, yStart + radius);
  ctx.quadraticCurveTo(xStart, yStart, xStart + radius, yStart);
  ctx.closePath();


  // ctx.fill();
  // ctx.strokeStyle='white';
  // ctx.lineWidth=2;
  // ctx.shadowColor='black';
  // ctx.shadowBlur=18;
  // //
  // ctx.beginPath();
  // ctx.arc(cx,cy,r,0,PI2);
  // ctx.clip();
  // ctx.stroke();
  // ctx.stroke();
  //
  // ctx.shadowColor='rgba(51, 51, 51,0.50)';
  // ctx.shadowBlur=4;
  // ctx.shadowOffsetY=3;
  // ctx.stroke();
  // ctx.stroke();


  // ctx.fillStyle = "red";
  // ctx.shadowColor = 0;
  // ctx.shadowOffsetX = 0; 
  // ctx.shadowOffsetY = 0;
  // ctx.shadowBlur = 0;

  // set shadowing
  // ctx.shadowColor = 'black';
  // ctx.shadowBlur = 10;

  // // stroke the shadowed rounded rectangle
  // ctx.lineWidth = 4;
  // ctx.stroke();

  // set compositing to erase everything outside the stroke

  // ctx.globalCompositeOperation = 'destination-in';
  // restrict new draw to cover existing pixels

  ctx.fillStyle = "#fff";
  ctx.fill();

  //ctx.globalCompositeOperation = 'source-atop';

  // // change the gCO
  // ctx.globalCompositeOperation = "source-atop";
  // ctx.shadowColor = "green";
  // ctx.shadowBlur = 8;
  // // now stroke to get the inner shadow
  // ctx.stroke();

  // // reset the gCO to its default
  // ctx.globalCompositeOperation = "source-over";
  // ctx.shadowColor = "rgba(128, 128, 128, 1)";
  // ctx.shadowBlur = 8;
  // ctx.shadowOffsetX = 0;
  // ctx.shadowOffsetY = 0;
  // shadowed stroke
  // "source-atop" clips off the undesired outer shadow
  // ctx.strokeStyle = "transparent";
  // ctx.stroke();
  // ctx.restore();
  // always clean up -- set compsiting back to default
  // ctx.globalCompositeOperation = 'source-over';


  // ctx.font = '600 16px "Font Awesome 5 Free"';
  //f1e2
  //e074
  //f666

  // ctx.fillText(String.fromCharCode(parseInt('f666', 16)), x + 9, y + 23);

  // ctx.font = '400 16px "Font Awesome 5 Brands"';
  // ctx.fillText(String.fromCharCode(parseInt('f425', 16)), x + 12, y + 23);


  // ctx.font = "16px Nunito";
  // ctx.fillText('7', x + 9, y + 23);
}