'use strict';
import { View } from '../View';
import { Form } from '../../components/form/Form';

import { LoginConstants } from './login.constants';
import { ElementHandler } from '../../shared/ui-utils/ElementHandler';
export class Login extends View {

   constructor() {
      super();
      // this.loginForm = new LoginForm(this.getNewUser.bind(this));

      this.loginForm = new Form();

      this.init();
   }

   init() {
      this.displayLoader();
      this.getClearedMainContainer().then(mainContainer => {
         mainContainer.append(this.renderLoginForm());
         this.hideLoader();
      });
   }

   renderLoginForm() {
      const container = document.createElement("div");
      ElementHandler.addElementStyleClass(container, LoginConstants.styleClassList.loginContainer);
      container.append(this.loginForm.renderForm(LoginConstants.formParams));
      return container;
   }


   getNewUser(user) {
      // this.interfaceActionHandler(user);
   }

}
