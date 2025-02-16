import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Main from "../components/Main";
import "../App.css";
import { useEffect } from "react";

function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData")) || {}

  useEffect(() => {
    const confirm = JSON.parse(sessionStorage.getItem("confirmed"))

    if (!userData) {
      navigate("/login");
    } else if (userData.positionName === "waiter" && confirm !== true) {
      navigate("/waiter-login");
    }

  }, [navigate]);

  const excludedPages = [
    "/login",
    "/waiter-todo","/waiter-notification",
    "/waiter-order","/departament",
    "/waiter-login",
    "/add-candidate",
    "/order","/addneworder","*",
  ];

  const isExcludedPage = /^\/order(\/[^/]+)?$/.test(location.pathname);
  const showHeader = !excludedPages.includes(location.pathname) && !isExcludedPage && (userData.positionName === null || userData.positionName === "admin");


  return (
    <div className="body">
      {showHeader && <Header />}
      <Main>{children}</Main>
    </div>
  );
}

export default Layout;
