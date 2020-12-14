import "./index.scss";
import { AppLoader } from "./app/components/loaders/app-loader/app-loader";

const loadApp = () => import("./app/app");
const loadNotifications = () =>
  import("./app/components/toast-notification/toast-notification");

document.addEventListener("DOMContentLoaded", () => {
  self.appLoader = AppLoader;

  loadNotifications().then(({ ToastNotifications }) => {
    self.toastNotifications = new ToastNotifications();

    loadApp().then(({ App }) => {
      new App();
    });
  });
});
