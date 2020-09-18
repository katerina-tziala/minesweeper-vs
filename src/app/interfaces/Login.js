'use strict';
import { Interface } from './Interface.js';

export class Login extends Interface {

   constructor(interfaceActionHandler) {
      super(interfaceActionHandler);
      // this.loginForm = new LoginForm(this.getNewUser.bind(this));
      this.init();
   }

   init() {
      this.displayLoader();
      this.getClearedMainContainer()
         .then(mainContainer => {
            console.log(mainContainer);
            // mainContainer.append(this.loginForm.generateLoginForm());
            this.hideLoader();
         });
   }

   getNewUser(user) {
      this.interfaceActionHandler(user);
   }

}
