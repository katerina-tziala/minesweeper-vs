'use strict';
import { ElementHandler } from '../../ui-utils/element-handler';
import { LoaderConstants } from './loader.constants';

export class Loader {

    static get loader() {
        return ElementHandler.getElementByID(LoaderConstants.elementsIDs.loader);
    }
    static get spinner() {
        return ElementHandler.getElementByID(LoaderConstants.elementsIDs.spinner);
    }

    static display() {
        Loader.startSpinner();
        Loader.displayLoader();
    }

    static hide() {
        Loader.hideLoader();
        Loader.stopSpinner();
    }

    static hideLoader() {
        Loader.loader.then(loader => ElementHandler.hideElement(loader));
    }

    static displayLoader() {
        Loader.loader.then(loader => ElementHandler.displayElement(loader));
    }

    static stopSpinner() {
        Loader.spinner.then(spinner => ElementHandler.removeElementStyleClass(spinner, LoaderConstants.styleClassList.spin));
    }

    static startSpinner() {
        Loader.spinner.then(spinner => ElementHandler.addElementStyleClass(spinner, LoaderConstants.styleClassList.spin));
    }

}
