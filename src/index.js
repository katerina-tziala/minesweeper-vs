import './index.scss';
import { App } from './app/App';

document.addEventListener('DOMContentLoaded', () => {
    new App();
});


// const btn = document.getElementById('btn');
// const getUserModule = () => import('./common/usersAPI');


// btn.addEventListener('click', () => {
//   getUserModule().then(({ getUsers }) => {
//     getUsers().then(json => console.log(json));
//   });
// });

