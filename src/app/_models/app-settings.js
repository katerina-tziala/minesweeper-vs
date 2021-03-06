// "use strict";

// import { AppModel } from "./app-model";

// import { Theme, MineType } from "../_enums/app-settings.enums";
// import { randomValueFromArray } from "~/_utils/utils";
// import { COLOR_TYPES } from "~/_constants/ui.constants";
// import { LocalStorageHelper } from "~/_utils/local-storage-helper";

// export class AppSettingsModel extends AppModel {
//   constructor() {
//     super();
//     this.#init();
//   }

//   #init() {
//     this.theme = Theme.Default;
//     this.mineType = randomValueFromArray(Object.values(MineType));
//     this.playerColorType = this.#generateColorType(this.opponentColorType);
//     this.opponentColorType = this.#generateColorType(this.playerColorType);
//     this.update(LocalStorageHelper.appSettings);
//   }

//   #generateColorType(typeToExclude) {
//     let types = COLOR_TYPES.filter((type) => type !== typeToExclude);
//     return randomValueFromArray(types);
//   }

//   saveLocally() {
//     LocalStorageHelper.appSettings = this;
//   }

// }
