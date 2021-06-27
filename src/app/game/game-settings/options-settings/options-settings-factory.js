'use strict';
// import { PageType } from './page-type.enum';
import { GameMode } from 'GAME_ENUMS'


import { OptionsSettingsOriginal } from './options-settings-original/options-settings-original';
import { OptionsSettingsDetect } from './options-settings-detect/options-settings-detect';
import { OptionsSettingsParallel } from './options-settings-parallel/options-settings-parallel';
import { OptionsSettingsClear } from './options-settings-clear/options-settings-clear';



export default class OptionsSettingsFactory {

    // static getOptionsSettingsControllerForMode(mode = GameMode.Original) {
    //     const optionsName = Object.keys(GameMode).find(key => GameMode[key] === mode);
    //     const moduleName = `OptionsSettings${optionsName}`;
    //     return import(`./options-settings-${mode}/options-settings-${mode}`).then(module => module[moduleName]);
    // }


    static getOptionsSettingsControllerForMode(mode = GameMode.Original) {
        if (mode === GameMode.Original)
            return new OptionsSettingsOriginal();
        if (mode === GameMode.Detect)
            return new OptionsSettingsDetect();
        if (mode === GameMode.Parallel)
            return new OptionsSettingsParallel();
        if (mode === GameMode.Clear)
            return new OptionsSettingsClear();
    }
}
