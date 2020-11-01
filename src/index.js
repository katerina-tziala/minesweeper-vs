import "./index.scss";
import { Loader } from "./app/components/loader/loader";

const loadApp = () => import("./app/app");
const loadNotifications = () => import("./app/components/toast-notification/toast-notification");

document.addEventListener("DOMContentLoaded", () => {
	self.appLoader = Loader;
	

	loadNotifications().then(({ToastNotifications}) => {

		self.toastNotifications = new ToastNotifications();

		loadApp().then(({App}) => {

			new App();
		});

	});

});
