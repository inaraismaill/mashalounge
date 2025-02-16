import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { CollapseContext } from "../Context/CollapseContext";
import style from "../styles/Main.module.css";

function Main({ children }) {
  const location = useLocation();
  const { isCollapsed } = useContext(CollapseContext);

  const excludedPages = [
    "/login",
    "/waiter-todo",
    "/add-candidate",
    "/departament",
    "/waiter-order",
    "/addneworder","/waiter-notification",
    "/waiter-login",
    "/order",
  ];

  const isExcludedPage =
    excludedPages.includes(location.pathname) ||
    /^\/order(\/[^/]+)?$/.test(location.pathname);

  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const isRestrictedPosition = !(userData.positionName=="admin" || userData.positionName==null)

  return (
    <div
      className={`${(isExcludedPage || isRestrictedPosition) ? style.main : style.mainFragment} ${
        isCollapsed ? style.collapsedMain : ""
      }`}
    >
      {children}
    </div>
  );
}

export default Main;
