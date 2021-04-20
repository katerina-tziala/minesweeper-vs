import "./index.scss";

import "./app/ui-elements/avatar/Avatar";
import "./app/ui-elements/loader/Loader";


 import { LoaderController } from "./app/controllers/app-loader";

// const loadApp = () => import("./app/app");
// const loadNotifications = () =>
//   import("./app/components/toast-notification/toast-notification");

// document.addEventListener("DOMContentLoaded", () => {
//   // self.appLoader = AppLoader;
//   console.log("loaded");
//   // loadNotifications().then(({ ToastNotifications }) => {
//   //   self.toastNotifications = new ToastNotifications();

//   //   loadApp().then(({ App }) => {
//   //     new App();
//   //   });
//   // });
//   const main = document.getElementById("main");

//   // const avatar = document.createElement("app-avatar");
//   // //avatar.classList.add("test");
//   // avatar.className = "test";
//   // main.append(avatar);
//   // const avatars = document.getElementsByTagName("app-avatar");
//   // console.log(avatars);
//   // setTimeout(() => {
//   //   avatars[0].setAttribute("type", "bot");
//   //   avatars[0].className = "sdf";
//   //   console.log("ddd");
//   // }, 2000);
// });

document.addEventListener("DOMContentLoaded", () => {

  console.log("loaded");

  self.appLoader = LoaderController;
  

  // const loader = document.getElementById("main-loader");
  
  // loader.display();
  setTimeout(() => {
    //loader.hide();
    self.appLoader.hide();
  }, 1000);
  //loader.show();
  // console.log(loader);
});
