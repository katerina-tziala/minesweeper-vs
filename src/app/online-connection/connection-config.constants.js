"use strict";

export const CONNECTION_CONFIG = {
  url: 'ws://localhost:9000',
  protocols: ['json', 'online-gaming-api'],
};

// export const TESTGAME = { "botMode": { "botMode": "easy" }, "optionsSettings": { "marks": false, "wrongFlagHint": false, "tileFlagging": true, "tileRevealing": true, "sneakPeekSettings": { "applied": false, "duration": 0, "limit": 0 }, "vsMode": "clear", "unlimitedFlags": true, "openStrategy": true }, "levelSettings": { "level": "beginner", "rows": 9, "columns": 9, "numberOfMines": 16, "minesPositions": [0, 6, 9, 19, 21, 40, 42, 48, 57, 60, 63, 65, 69, 74, 76, 80] }, "turnSettings": { "turnTimer": true, "turnDuration": 5, "missedTurnsLimit": 3, "consecutiveTurns": true }, "type": "bot", "players": [{ "id": "kate", "name": "kate", "entered": false, "isBot": false, "goal": "clear", "goalTargetNumber": 0, "maxAllowedFlags": null, "allowedTurns": null, "turn": false, "moves": 0, "lostGame": false, "redundantFlagsPositions": [], "detectedMinesPositions": [], "revealedPositions": [], "marksPositions": [], "detonatedMinesPositions": [] }, { "id": "minesweeper-bot", "name": "Bot (Naive)", "entered": false, "isBot": true, "goal": "clear", "goalTargetNumber": 0, "maxAllowedFlags": null, "allowedTurns": null, "turn": false, "moves": 0, "lostGame": false, "redundantFlagsPositions": [], "detectedMinesPositions": [], "revealedPositions": [], "marksPositions": [], "detonatedMinesPositions": [], "mode": "easy" }], "playerStartID": "kate" };


// export const TESTINVITATION = { "id": "t1GXcom0jpO5v2ps52pTtA9K9hfmv4XR__2021-02-20T13:05:28.876Z", "createdAt": "2021-02-20T13:05:28.876Z", "sender": { "id": "ETzwX5BwsbOsGrsGEF43adAo1ZRnzO0S__2021-02-20T13:05:12.348Z", "username": "WWWWWWWWWWWWWWWW", "gameRoomId": "Nv5rYvzpSjEcVtnxNbPpKnNvHVZYYozq__2021-02-20T13:05:28.876Z" }, "game": { "id": "Nv5rYvzpSjEcVtnxNbPpKnNvHVZYYozq__2021-02-20T13:05:28.876Z", "roomType": "default", "entryURL": "gamingHost?gameId=Nv5rYvzpSjEcVtnxNbPpKnNvHVZYYozq__2021-02-20T13:05:28.876Z", "optionsSettings": { "marks": false, "wrongFlagHint": false, "tileFlagging": true, "tileRevealing": true, "sneakPeekSettings": { "applied": false, "duration": 0, "limit": 0 }, "vsMode": "clear", "unlimitedFlags": true, "openStrategy": true }, "levelSettings": { "level": "beginner", "rows": 9, "columns": 9, "numberOfMines": 16, "minesPositions": [4, 8, 13, 18, 19, 24, 25, 28, 29, 31, 40, 42, 47, 68, 76, 78] }, "turnSettings": { "turnTimer": true, "turnDuration": 5, "missedTurnsLimit": 3, "consecutiveTurns": true }, "type": "online", "players": [{ "id": "ETzwX5BwsbOsGrsGEF43adAo1ZRnzO0S__2021-02-20T13:05:12.348Z", "name": "kate", "entered": false, "isBot": false, "goal": "clear", "goalTargetNumber": 0, "maxAllowedFlags": null, "allowedTurns": null, "turn": false, "moves": 0, "lostGame": false, "redundantFlagsPositions": [], "detectedMinesPositions": [], "revealedPositions": [], "marksPositions": [], "detonatedMinesPositions": [] }, { "id": "pTkBpsqsAf5WMm1prw0w8z52CDEa7NOs__2021-02-20T13:05:17.189Z", "name": "tzzz", "entered": false, "isBot": false, "goal": "clear", "goalTargetNumber": 0, "maxAllowedFlags": null, "allowedTurns": null, "turn": false, "moves": 0, "lostGame": false, "redundantFlagsPositions": [], "detectedMinesPositions": [], "revealedPositions": [], "marksPositions": [], "detonatedMinesPositions": [] }], "playerStartID": "ETzwX5BwsbOsGrsGEF43adAo1ZRnzO0S__2021-02-20T13:05:12.348Z" } };

// export const INVITATIONSTEST = [
//   {
//     "id": "t1GXcom0jpO5v2ps52pTtA9K9hfmv54XR__2021-02-20T13:05:28.876Z", "createdAt": "2021-02-20T13:05:28.876Z",
//     "sender": { "id": "ETzwX5BwsbOsGrsGEF43adAo1ZRnzO0S__2021-02-20T13:05:12.348Z", "username": "WWWWWWWWWWWWWWWW", "gameRoomId": "Nv5rYvzpSjEcVtnxNbPpKnNvHVZYYozq__2021-02-20T13:05:28.876Z" },
//     "game": { "id": "Nv5rYvzpSjEcVtnxNbPpKnNvHVZYYozq__2021-02-20T13:05:28.876Z", "roomType": "default", "entryURL": "gamingHost?gameId=Nv5rYvzpSjEcVtnxNbPpKnNvHVZYYozq__2021-02-20T13:05:28.876Z", "optionsSettings": { "marks": false, "wrongFlagHint": false, "tileFlagging": true, "tileRevealing": true, "sneakPeekSettings": { "applied": false, "duration": 0, "limit": 0 }, "vsMode": "clear", "unlimitedFlags": true, "openStrategy": true }, "levelSettings": { "level": "beginner", "rows": 9, "columns": 9, "numberOfMines": 16, "minesPositions": [4, 8, 13, 18, 19, 24, 25, 28, 29, 31, 40, 42, 47, 68, 76, 78] }, "turnSettings": { "turnTimer": true, "turnDuration": 5, "missedTurnsLimit": 3, "consecutiveTurns": true }, "type": "online", "players": [{ "id": "ETzwX5BwsbOsGrsGEF43adAo1ZRnzO0S__2021-02-20T13:05:12.348Z", "name": "kate", "entered": false, "isBot": false, "goal": "clear", "goalTargetNumber": 0, "maxAllowedFlags": null, "allowedTurns": null, "turn": false, "moves": 0, "lostGame": false, "redundantFlagsPositions": [], "detectedMinesPositions": [], "revealedPositions": [], "marksPositions": [], "detonatedMinesPositions": [] }, { "id": "pTkBpsqsAf5WMm1prw0w8z52CDEa7NOs__2021-02-20T13:05:17.189Z", "name": "tzzz", "entered": false, "isBot": false, "goal": "clear", "goalTargetNumber": 0, "maxAllowedFlags": null, "allowedTurns": null, "turn": false, "moves": 0, "lostGame": false, "redundantFlagsPositions": [], "detectedMinesPositions": [], "revealedPositions": [], "marksPositions": [], "detonatedMinesPositions": [] }], "playerStartID": "ETzwX5BwsbOsGrsGEF43adAo1ZRnzO0S__2021-02-20T13:05:12.348Z" }
//   },
//   {
//     "id": "t1GXcom0jpO5v2ps52pTtA9K9hhfmv4Xd__2021-02-20T13:05:28.876Z", "createdAt": "2021-02-20T13:05:28.876Z",
//     "sender": { "id": "ETzwdX5BwsbOsGrsGEF43adAo1ZRnzO0S__2021-02-20T13:05:12.348Z", "username": "WWWWWWWWWWWWWWWW", "gameRoomId": "Nv5rYvzpSjEcVtnxNbPpKnNvHVZYYozq__2021-02-20T13:05:28.876Z" },
//     "game": { "id": "Nv5rYvzpSjEcVtnxNbPpKnNvHVZYYozq__2021-02-20T13:05:28.876Z", "roomType": "default", "entryURL": "gamingHost?gameId=Nv5rYvzpSjEcVtnxNbPpKnNvHVZYYozq__2021-02-20T13:05:28.876Z", "optionsSettings": { "marks": false, "wrongFlagHint": false, "tileFlagging": true, "tileRevealing": true, "vsMode": "detect", "unlimitedFlags": true }, "levelSettings": { "level": "expert", "rows": 16, "columns": 30, "numberOfMines": 99, "minesPositions": [3, 7, 25, 31, 33, 46, 50, 51, 55, 58, 59, 62, 67, 68, 72, 81, 83, 85, 86, 93, 94, 95, 97, 104, 105, 108, 110, 114, 123, 129, 132, 135, 136, 137, 140, 144, 151, 153, 156, 159, 164, 166, 167, 170, 171, 180, 184, 186, 188, 194, 201, 211, 214, 215, 216, 217, 218, 224, 235, 261, 263, 266, 286, 292, 294, 296, 298, 300, 304, 311, 320, 321, 325, 339, 344, 349, 350, 351, 353, 354, 364, 369, 400, 410, 411, 415, 423, 425, 429, 433, 437, 443, 445, 456, 459, 460, 465, 470, 476] }, "turnSettings": { "turnTimer": true, "turnDuration": 5, "missedTurnsLimit": 3, "consecutiveTurns": false }, "type": "bot", "players": [{ "id": "kate", "name": "katerina", "entered": false, "isBot": false, "goal": "clear", "goalTargetNumber": 0, "maxAllowedFlags": null, "allowedTurns": null, "turn": false, "moves": 0, "lostGame": false, "redundantFlagsPositions": [], "detectedMinesPositions": [], "revealedPositions": [], "marksPositions": [], "detonatedMinesPositions": [] }, { "id": "minesweeper-bot", "name": "Bot (Naive)", "entered": false, "isBot": true, "goal": "clear", "goalTargetNumber": 0, "maxAllowedFlags": null, "allowedTurns": null, "turn": false, "moves": 0, "lostGame": false, "redundantFlagsPositions": [], "detectedMinesPositions": [], "revealedPositions": [], "marksPositions": [], "detonatedMinesPositions": [], "mode": "easy" }], "playerStartID": "kate" }
//   },
//   {
//     "id": "t1GXdcom0jpO5v2ps452pTtdA9K9hfmvd4Xd__2021-02-20T13:05:28.876Z", "createdAt": "2021-02-20T13:05:28.876Z",
//     "sender": { "id": "ETzwdX5BwsbOsGrsGEF43adAo1ZRnzO0S__2021-02-20T13:05:12.348Z", "username": "katerina", "gameRoomId": "Nv5rYvzpSjEcVtnxNbPpKnNvHVZYYozq__2021-02-20T13:05:28.876Z" },
//     "game": { "id": "Nv5rYvzpSjEcVtnxNbPpKnNvHVZYYozq__2021-02-20T13:05:28.876Z", "roomType": "default", "entryURL": "gamingHost?gameId=Nv5rYvzpSjEcVtnxNbPpKnNvHVZYYozq__2021-02-20T13:05:28.876Z", "optionsSettings": { "marks": false, "wrongFlagHint": false, "tileFlagging": true, "tileRevealing": true, "sneakPeekSettings": { "applied": true, "duration": 2, "limit": 1 }, "vsMode": "parallel", "identicalMines": true, "openCompetition": false }, "levelSettings": { "level": "custom", "rows": 9, "columns": 12, "numberOfMines": 26, "minesPositions": [0, 1, 2, 6, 20, 21, 22, 27, 28, 29, 32, 35, 46, 47, 52, 54, 60, 62, 63, 71, 72, 73, 75, 76, 80, 97] }, "turnSettings": { "turnTimer": true, "turnDuration": 5, "missedTurnsLimit": 3, "consecutiveTurns": false }, "type": "bot", "players": [{ "id": "kate", "name": "katerina", "entered": false, "isBot": false, "goal": "clear", "goalTargetNumber": 0, "maxAllowedFlags": null, "allowedTurns": null, "turn": false, "moves": 0, "lostGame": false, "redundantFlagsPositions": [], "detectedMinesPositions": [], "revealedPositions": [], "marksPositions": [], "detonatedMinesPositions": [] }, { "id": "minesweeper-bot", "name": "Bot (Naive)", "entered": false, "isBot": true, "goal": "clear", "goalTargetNumber": 0, "maxAllowedFlags": null, "allowedTurns": null, "turn": false, "moves": 0, "lostGame": false, "redundantFlagsPositions": [], "detectedMinesPositions": [], "revealedPositions": [], "marksPositions": [], "detonatedMinesPositions": [], "mode": "easy" }], "playerStartID": "kate" }
//   },
//   {
//     "id": "t1GXsdfdcom0jpO5v2ps52pTnfhtA9K9hfmvd4Xd__2021-02-20T13:05:28.876Z", "createdAt": "2021-02-20T13:05:28.876Z",
//     "sender": { "id": "ETzwdX5BwsbOsGrsGEF43adAo1ZRnzO0S__2021-02-20T13:05:12.348Z", "username": "no flagging", "gameRoomId": "Nv5rYvzpSjEcVtnxNbPpKnNvHVZYYozq__2021-02-20T13:05:28.876Z" },
//     "game": { "id": "Nv5rYvzpSjEcVtnxNbPpKnNvHVZYYozq__2021-02-20T13:05:28.876Z", "roomType": "default", "entryURL": "gamingHost?gameId=Nv5rYvzpSjEcVtnxNbPpKnNvHVZYYozq__2021-02-20T13:05:28.876Z","optionsSettings":{"marks":false,"wrongFlagHint":false,"tileFlagging":false,"tileRevealing":true,"sneakPeekSettings":{"applied":false,"duration":0,"limit":0},"vsMode":"clear","unlimitedFlags":true,"openStrategy":true},"levelSettings":{"level":"beginner","rows":9,"columns":9,"numberOfMines":16,"minesPositions":[1,8,12,16,17,26,28,38,40,45,46,51,53,60,68,80]},"turnSettings":{"turnTimer":true,"turnDuration":5,"missedTurnsLimit":3,"consecutiveTurns":true},"type":"bot","players":[{"id":"kate","name":"katerina","entered":false,"isBot":false,"goal":"clear","goalTargetNumber":0,"maxAllowedFlags":null,"allowedTurns":null,"turn":false,"moves":0,"lostGame":false,"redundantFlagsPositions":[],"detectedMinesPositions":[],"revealedPositions":[],"marksPositions":[],"detonatedMinesPositions":[]},{"id":"minesweeper-bot","name":"Bot (Naive)","entered":false,"isBot":true,"goal":"clear","goalTargetNumber":0,"maxAllowedFlags":null,"allowedTurns":null,"turn":false,"moves":0,"lostGame":false,"redundantFlagsPositions":[],"detectedMinesPositions":[],"revealedPositions":[],"marksPositions":[],"detonatedMinesPositions":[],"mode":"easy"}],"playerStartID":"kate"}
//   },
  
// ];
