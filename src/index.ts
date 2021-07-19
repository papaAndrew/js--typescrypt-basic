import "../style/style.css";
import { Dashboard } from "./control/Dashboard";
import { DashboardView } from "./view/DashboardView";

const domMain = document.querySelector(".main") as HTMLElement;

new Dashboard(new DashboardView(domMain));
