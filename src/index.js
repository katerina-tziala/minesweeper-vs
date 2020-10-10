
import { ToastNotifications } from './app/skeleton/toast-notification/toast-notification';
import { Loader } from './app/skeleton/loader/loader';

import { App } from './app/app';

import './index.scss';
import './app/skeleton/skeleton.scss';

document.addEventListener('DOMContentLoaded', () => {
    self.Loader = Loader;
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

