'use strict';
import { PageType } from './page-type.enum';

export default class PageLoaderService {
    #selectedPage;

    constructor() {
        this.onPageChanged = undefined;
        this.#selectedPage = PageType.JoinPage;
    }

    static getInstance() {
        if (!PageLoaderService.instance) {
            PageLoaderService.instance = new PageLoaderService;
        }
        return PageLoaderService.instance;
    }

    nextPage(page) {
        console.log('page changed -> nextPage : ', page);
        if (Object.values(PageType).includes(page)) {
            this.#selectedPage = page;
            this.#notifyPageChange();
        } else {
            console.log("unknown page, ", page);
        }
    }

    #notifyPageChange() {
        if (this.onPageChanged) {
            this.#loadPage(this.#selectedPage)
            .then(page => this.onPageChanged(page))
            .catch(error => {
                console.log(error);
                console.log('could not load page');
            });
        }
    }

    #loadPage(type) {
        const pageName = Object.keys(PageType).find(key => PageType[key] === type);
        return import(`./${type}-page/${type}-page`).then(module => module[pageName]);
    }

}