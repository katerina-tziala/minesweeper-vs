"use strict";
import { PageType } from "~/_enums/page-type.enum";

export class PageLoader {

  static load(type, onPageChange) {
    const pageName = Object.keys(PageType).find(key => PageType[key] === type);
    return import(`./${type}-page/${type}-page`).then(module => {
      return new module[pageName](onPageChange);
    });
  }

}
