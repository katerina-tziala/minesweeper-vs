import './index.scss';
import './app/ui-elements/loader/Loader';
import { AppLoaderHandler } from './app/app-loader.handler';
import { App } from './app/App';

document.addEventListener('DOMContentLoaded', () => {
  AppLoaderHandler.display();
  new App();
});
