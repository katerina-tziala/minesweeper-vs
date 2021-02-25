"use strict";

export const CONNECTION_CONFIG = {
  url: "ws://localhost:9000",
  protocols: ["json", "online-gaming"],
};

export const TESTGAME = { "botMode": { "botMode": "easy" }, "optionsSettings": { "marks": false, "wrongFlagHint": false, "tileFlagging": true, "tileRevealing": true, "sneakPeekSettings": { "applied": false, "duration": 0, "limit": 0 }, "vsMode": "clear", "unlimitedFlags": true, "openStrategy": true }, "levelSettings": { "level": "beginner", "rows": 9, "columns": 9, "numberOfMines": 16, "minesPositions": [0, 6, 9, 19, 21, 40, 42, 48, 57, 60, 63, 65, 69, 74, 76, 80] }, "turnSettings": { "turnTimer": true, "turnDuration": 5, "missedTurnsLimit": 3, "consecutiveTurns": true }, "type": "bot", "players": [{ "id": "kate", "name": "kate", "entered": false, "isBot": false, "goal": "clear", "goalTargetNumber": 0, "maxAllowedFlags": null, "allowedTurns": null, "turn": false, "moves": 0, "lostGame": false, "redundantFlagsPositions": [], "detectedMinesPositions": [], "revealedPositions": [], "marksPositions": [], "detonatedMinesPositions": [] }, { "id": "minesweeper-bot", "name": "Bot (Naive)", "entered": false, "isBot": true, "goal": "clear", "goalTargetNumber": 0, "maxAllowedFlags": null, "allowedTurns": null, "turn": false, "moves": 0, "lostGame": false, "redundantFlagsPositions": [], "detectedMinesPositions": [], "revealedPositions": [], "marksPositions": [], "detonatedMinesPositions": [], "mode": "easy" }], "playerStartID": "kate" };


export const TESTINVITATION = {"id":"t1GXcom0jpO5v2ps52pTtA9K9hfmv4XR__2021-02-20T13:05:28.876Z","createdAt":"2021-02-20T13:05:28.876Z","sender":{"id":"ETzwX5BwsbOsGrsGEF43adAo1ZRnzO0S__2021-02-20T13:05:12.348Z","username":"WWWWWWWWWWWWWWWW","gameRoomId":"Nv5rYvzpSjEcVtnxNbPpKnNvHVZYYozq__2021-02-20T13:05:28.876Z"},"game":{"id":"Nv5rYvzpSjEcVtnxNbPpKnNvHVZYYozq__2021-02-20T13:05:28.876Z","roomType":"default","entryURL":"gamingHost?gameId=Nv5rYvzpSjEcVtnxNbPpKnNvHVZYYozq__2021-02-20T13:05:28.876Z","optionsSettings":{"marks":false,"wrongFlagHint":false,"tileFlagging":true,"tileRevealing":true,"sneakPeekSettings":{"applied":false,"duration":0,"limit":0},"vsMode":"clear","unlimitedFlags":true,"openStrategy":true},"levelSettings":{"level":"beginner","rows":9,"columns":9,"numberOfMines":16,"minesPositions":[4,8,13,18,19,24,25,28,29,31,40,42,47,68,76,78]},"turnSettings":{"turnTimer":true,"turnDuration":5,"missedTurnsLimit":3,"consecutiveTurns":true},"type":"online","players":[{"id":"ETzwX5BwsbOsGrsGEF43adAo1ZRnzO0S__2021-02-20T13:05:12.348Z","name":"kate","entered":false,"isBot":false,"goal":"clear","goalTargetNumber":0,"maxAllowedFlags":null,"allowedTurns":null,"turn":false,"moves":0,"lostGame":false,"redundantFlagsPositions":[],"detectedMinesPositions":[],"revealedPositions":[],"marksPositions":[],"detonatedMinesPositions":[]},{"id":"pTkBpsqsAf5WMm1prw0w8z52CDEa7NOs__2021-02-20T13:05:17.189Z","name":"tzzz","entered":false,"isBot":false,"goal":"clear","goalTargetNumber":0,"maxAllowedFlags":null,"allowedTurns":null,"turn":false,"moves":0,"lostGame":false,"redundantFlagsPositions":[],"detectedMinesPositions":[],"revealedPositions":[],"marksPositions":[],"detonatedMinesPositions":[]}],"playerStartID":"ETzwX5BwsbOsGrsGEF43adAo1ZRnzO0S__2021-02-20T13:05:12.348Z"}};