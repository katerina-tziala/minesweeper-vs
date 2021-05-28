'use strict';
import { PageType } from './page-type.enum';
import * as PAGES from 'PAGES';

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

    nextPage(page, params) {
        console.log('page changed -> nextPage : ', page);
        if (!Object.values(PageType).includes(page)) {
            throw new Error(`unknown page, ${page}`);
        }
        this.#selectedPage = page;
        if (!this.onPageChanged) {
            return;
        }
        this.onPageChanged(this.#loadPage(page, params));
    }

    #loadPage(page, params) {
        try {
            return new PAGES[page](params);
        }
        catch (err) {
            throw new Error(`could not load page, ${page}`);
        }
    }

}