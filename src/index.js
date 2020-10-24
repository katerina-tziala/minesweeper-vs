
import './index.scss';

import { ToastNotifications } from './app/skeleton/toast-notification/toast-notification';
import { Loader } from './app/skeleton/loader/loader';

import { App } from './app/app';



document.addEventListener('DOMContentLoaded', () => {
    self.appLoader = Loader;
    self.toastNotifications = new ToastNotifications();
    new App();
});


// const btn = document.getElementById('btn');
// const getUserModule = () => import('./common/usersAPI');


// btn.addEventListener('click', () => {
//   getUserModule().then(({ getUsers }) => {
//     getUsers().then(json => console.log(json));
//   });
// });

