"use strict";
// import { TYPOGRAPHY } from "~/_constants/typography.constants";
// import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";

// import { Switcher } from "UserInputs";

// import { GameType, GameVSMode, OptionsSettings, Player, GameOriginal } from "Game";

// import { LevelWizard, OptionsWizard, OptionsWizardVS, VSTypeWizard } from "../game-settings-wizards/game-settings-wizards";

// import { LocalStorageHelper } from "~/_utils/local-storage-helper";
// import { DOM_ELEMENT_ID, DOM_ELEMENT_CLASS, CONTENT, BUTTONS, FORM_PARAMS, WIZARDS_ORDER } from "./game-wizard-vs.constants";
// import { preventInteraction, clone, replaceStringParameter } from "~/_utils/utils";
// import { NOTIFICATION_MESSAGE } from "~/components/toast-notification/toast-notification.constants";

import { GameWizard } from "../game-wizard";
// import { FormUsername } from "~/components/form/form-username/form-username";

export class GameWizardVS extends GameWizard {
    // #opponent;
    // #usernameForm;
    // #currentStep;

    constructor(onClose, submitGame) {
        super(onClose, submitGame);
    }

    // set currentStep(opponent) {
    //     this.#currentStep = opponent;
    // }

    // get currentStep() {
    //     return this.#currentStep;
    // }

    // get type() {
    //     return GameType.Friend;
    // }

    // get title() {
    //     return this.opponent ? this.wizardTitleWhenOpponent : CONTENT.addPlayer;
    // }

    // get wizardTitleWhenOpponent() {
    //     return replaceStringParameter(CONTENT.vs, this.opponent.name);
    // }

    // set opponent(opponent) {
    //     this.#opponent = opponent;
    // }

    // get opponent() {
    //     return this.#opponent;
    // }

    // set usernameForm(usernameForm) {
    //     this.#usernameForm = usernameForm;
    // }

    // get usernameForm() {
    //     return this.#usernameForm;
    // }

    // renderWizardContent(wizardContent) {
    //     super.renderWizardContent(wizardContent);
    //     if (this.opponent) {
    //         this.renderStepWizard(wizardContent);
    //     } else {
    //         this.renderOpponentForm(wizardContent);
    //     }
    // }

    // renderOpponentForm(wizardContainer) {
    //     super.renderWizardContent(wizardContainer);
    //     this.usernameForm = new FormUsername(this.getOpponentName.bind(this), TYPOGRAPHY.emptyString);
    //     wizardContainer.append(this.usernameForm.renderForm(FORM_PARAMS));
    // }

    // getOpponentName(params) {
    //     if (this.player.name === params.username) {
    //         self.toastNotifications.show(NOTIFICATION_MESSAGE.opponentPlayerSameName);
    //     } else {
    //         this.opponent = new Player("localOpponent", params.username, true);
    //         this.resetWizard();
    //     }
    // }

    // resetWizard() {
    //     this.wizardTitleElement.then(title => title.innerHTML = this.title);
    //     this.wizardContentElement.then(wizardContent => this.renderWizardContent(wizardContent));
    //     this.wizardActionsElement.then(wizardActions => {
    //         ElementHandler.clearContent(wizardActions);
    //         this.addActions(wizardActions);
    //     });
    // }

    // getWizardActionButtons() {
    //     const actionButtons = [];
    //     if (this.opponent) {
    //         // previous
    //         const previousBtn = ElementGenerator.generateButton(BUTTONS.previous, this.onPrevious.bind(this));
    //         ElementHandler.setDisabled(previousBtn, true);
    //         actionButtons.push(previousBtn);
    //         // reset
    //         actionButtons.push(this.generateResetButton());
    //         // next
    //         const nextBtn = ElementGenerator.generateButton(BUTTONS.next, this.onNext.bind(this));
    //         actionButtons.push(nextBtn);
    //     }
    //     return actionButtons;
    // }

    // generateNextButton() {
    //     return ElementGenerator.generateButton(BUTTONS.next, this.onNext.bind(this));
    // }

    // init() {
    //     this.currentStep = 0;
    //     this.setVSTypeSettings();
    //     super.init();
    // }

    // setFirstStepWizards() {
    //     const vsTypeWizard = new VSTypeWizard(this.onVSTypeChange.bind(this), this.vsType);
    //     this.setSettingsWizards("vsTypeMode", vsTypeWizard, true);
    // }

    // setSecondStepWizards() {
    //     // level wizard
    //     this.setSettingsWizards("levelSettings", this.generateLevelWizard(), true);
    //     if (this.vsType === GameVSMode.Parallel) {
    //         // options wizard
    //         this.setSettingsWizards("optionsSettings", this.generateOptionsWizard());
    //     }
    // }

    // setThirdStepWizards() {

    //     console.log("setThirdStepWizards");
    // }

    // generateOptionsWizard() {
    //     if (this.vsType !== GameVSMode.Parallel) {
    //         return new OptionsWizardVS(this.optionsSettings, this.onValidation.bind(this));
    //     }
    //     return new OptionsWizard(this.optionsSettings, this.onValidation.bind(this));
    // }

    // setCurrentWizards() {
    //     this.submissionPrevented = false;
    //     switch (this.currentStep) {
    //         case 1:
    //             this.setSecondStepWizards();
    //             break;
    //         case 2:
    //             this.setThirdStepWizards();
    //             break;
    //         case 3:
    //             this.setSettingsWizards("optionsSettings", this.generateOptionsWizard(), true);
    //             break;
    //         default: // first step
    //             this.setFirstStepWizards();
    //             break;
    //     }
    // }






    // renderStepWizard(wizardContent) {
    //     ElementHandler.clearContent(wizardContent);
    //     this.settingsWizards.forEach(wizard => wizardContent.append(wizard.renderWizard()));
    // }



    // setVSTypeSettings() {
    //     let vsTypeMode = LocalStorageHelper.retrieve("vsTypeMode");
    //     vsTypeMode = vsTypeMode ? vsTypeMode : GameVSMode.Clear;
    //     this.wizardsOrder = WIZARDS_ORDER[vsTypeMode];
    //     this.setGameSettings("vsTypeMode", vsTypeMode);
    // }

    // get vsType() {
    //     return this.getGameSettings("vsTypeMode");
    // }

    // getInitialOptionsSettings() {
    //     const optionsSettings = new OptionsSettings(this.vsType);
    //     return this.updateOptionSettingsWithSelectedValues(optionsSettings);
    // }

    // get currentStepWizardType() {
    //     return this.wizardsOrder[this.currentStep];
    // }

    // get currentStepWizard() {
    //     return this.getSettingsWizardByName(this.currentStepWizardType);
    // }

    // updateCurrentStep(value) {
    //     this.currentStep = this.currentStep + value;
    // }

    // togglePreviousButton(disabled) {
    //     this.toggleButton(DOM_ELEMENT_ID.previousButton, disabled);
    // }

    // get nextButton() {
    //     return ElementHandler.getByID(DOM_ELEMENT_ID.nextButton);
    // }

    // toggleButton(buttonID, disabled) {
    //     ElementHandler.getByID(buttonID).then(button => ElementHandler.setDisabled(button, disabled));
    // }

    // get onLastStep() {
    //     return this.currentStep === this.wizardsOrder.length - 1;
    // }

    // setNextStepButton() {
    //     this.playBtn.then(button => button.remove());
    //     this.wizardActionsElement.then(wizardActions => wizardActions.append(this.generateNextButton()));
    // }

    // setLastStepButton() {
    //     this.nextButton.then(button => button.remove());
    //     this.wizardActionsElement.then(wizardActions => wizardActions.append(this.generatePlayButton()));
    // }

    // saveCurrentStepSettings() {
    //     const stepSettings = this.getGameSettings(this.currentStepWizardType);
    //     if (stepSettings) {
    //         this.setGameSettings(this.currentStepWizardType, stepSettings);
    //         LocalStorageHelper.save(this.currentStepWizardType, stepSettings);
    //     }
    // }

    // onPrevious() {
    //     if (this.onLastStep) {
    //         this.setNextStepButton(true);
    //     }
    //     this.saveCurrentStepSettings();
    //     this.updateCurrentStep(-1);
    //     if (this.currentStep === 0) {
    //         this.togglePreviousButton(true);
    //     }
    //     this.setCurrentWizards();
    //     this.resetWizard();
    // }

    // resetWizard() {
    //     this.wizardContentElement.then(wizardContainer => this.renderStepWizard(wizardContainer));
    // }

    // onNext() {
    //     this.saveCurrentStepSettings();
    //     this.updateCurrentStep(1);
    //     if (this.currentStep === 1) {
    //         this.togglePreviousButton(false);
    //     }
    //     if (this.onLastStep) {
    //         this.setLastStepButton();
    //     }
    //     this.setCurrentWizards();
    //     this.resetWizard();
    // }

    // onVSTypeChange(selectedVSType) {
    //     LocalStorageHelper.save("vsTypeMode", selectedVSType);
    //     this.setVSTypeSettings();
    //     this.setOptionsSettings();
    //     LocalStorageHelper.save("optionsSettings", this.optionsSettings);
    // }

    // onReset() {
    //     console.log("onReset");
    //     console.log("reset step");
    //     console.log(this.currentStep);
    // }

    // updateSubmissionButton() {
    //     console.log("updateSubmissionButton");
    //     console.log(this.currentStep);
    //     //this.playBtn.then(btn => ElementHandler.setDisabled(btn, this.submissionPrevented));
    // }


    // onPlay() {
    //     console.log("onPlay");
    // }
}
