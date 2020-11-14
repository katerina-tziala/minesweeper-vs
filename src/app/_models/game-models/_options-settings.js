"use strict";

import { AppModel } from "~/_models/_app-model";

export class OptionsSettings extends AppModel {

    constructor() {
        super();
        this.marks = false;
        this.wrongFlagHint = false;
    }

}
