"use strict";

export const DOM_ELEMENT_ID = {
  digit: "-digit--",


};

export const DOM_ELEMENT_CLASS = {
  counter: "digital-counter",
  digit: "digital-counter__digit",
  digitLine: "digit__line",
  digitLineOn: "digit__line--on",

};
export const DIGIT_POSITIONS = {
  0: [1, 2, 3, 4, 5, 6],
  1: [2, 3],
  2: [2, 3, 5, 6, 7],
  3: [2, 3, 4, 5, 7],
  4: [1, 3, 4, 7],
  5: [1, 2, 4, 5, 7],
  6: [1, 2, 4, 5, 6, 7],
  7: [2, 3, 4],
  8: [1, 2, 3, 4, 5, 6, 7],
  9: [1, 2, 3, 4, 5, 7],
  minus: [7],
  undefined: [1, 4, 7],
  noNumber: [2, 3, 4, 5, 6]
};



//     static digitPositions = {

//     };

// "use strict";
// class DigitalCounterConstants {

//     static type = {
//         mineCounter: "mineCounter",
//         timeCounter: "timeCounter"
//     };

//     static classList = {
//         counter: "digitalCounter",
//         digit: "digitalCounter__digit",
//         digitLine: "digitalCounter__digitLine",
//         digitLineHorizontal: "digitalCounter__digitLine--horizontal",
//         digitLineVertical: "digitalCounter__digitLine--vertical",
//         digitLineOn: "digitalCounter__digitLine--on"
//     };



//     static digitHorizontalPositions = [1, 4, 7];

//     static minusPositionKey = "minus";

//     static defaultPositionKey = "0";

//     static maxCounterNumber = 999;

//     static minCounterNumber = -99;

//     static defaultDigitsArrays = {
//         undefined: ["undefined", "undefined", "undefined"],
//         exceedsUpper: ["noNumber", "noNumber", "noNumber"],
//         exceedsLower: ["minus", "noNumber", "noNumber"],
//         allZeros: ["0", "0", "0"]
//     };

// }