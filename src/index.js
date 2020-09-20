

import './index.scss';
import { App } from './app/App';
if(module.hot) {
    module.hot.accept();
}
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

