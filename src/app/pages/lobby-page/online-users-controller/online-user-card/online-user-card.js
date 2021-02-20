"use strict";
import { INVITE_BTN } from "~/_constants/btn-text.constants";
import { clone } from "~/_utils/utils.js";
import { ElementHandler, ElementGenerator } from "HTML_DOM_Manager";
import { DOM_ELEMENT_CLASS } from "./online-user-card.constants";
import { UserAvatar } from "~/components/user-avatar/user-avatar";

export class OnlineUserCard {

  static generateView(user, onSelected) {
    const styles = [DOM_ELEMENT_CLASS.userCard];
    if (user.inGame) {
      styles.push(DOM_ELEMENT_CLASS.userCardInGame)
    }
    const userCard = ElementGenerator.generateContainer(styles);
    userCard.append(
      UserAvatar.generate(),
      OnlineUserCard.#generateUserName(user),
      OnlineUserCard.#generateInvitationButton(user, onSelected)
    );
    return userCard;
  }

  static #generateUserName(user) {
    const name = ElementGenerator.generateContainer([DOM_ELEMENT_CLASS.name]);
    name.innerHTML = user.username;
    name.title = user.username;
    return name;
  }

  static #generateInvitationButton(user, onSelected) {
    const params = clone(INVITE_BTN);
    params.attributes["aria-label"] = params.attributes["aria-label"] + user.username;
    const button = ElementGenerator.generateButton(params, () => onSelected(user));
    //ElementHandler.setDisabled(button, user.inGame);
    return button;
  }

}
