import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import AuthnComponent from "./AuthnComponent";
import style from "../styles/Header/Header.module.css";
import Decreaser from "../assets/svg/Decreaser";
import HomeBtn from "../assets/svg/HeaderButtons/HomeBtn";
import CandidatesBtn from "../assets/svg/HeaderButtons/CandidatesBtn";
import OrdersBtn from "../assets/svg/HeaderButtons/OrdersBtn";
import MessagesBtn from "../assets/svg/HeaderButtons/MessagesBtn";
import ItemsBtn from "../assets/svg/HeaderButtons/ItemsBtn";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import ExpensesBtn from "../assets/svg/HeaderButtons/ExpensesBtn";
import ExployeeDet from "../assets/svg/HeaderButtons/ExployeeDet";
import MenuIcon from "@mui/icons-material/Menu";
import ReportBtn from "../assets/svg/HeaderButtons/ReportBtn";
import LogBtn from "../assets/svg/HeaderButtons/LogBtn";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { CollapseContext } from "../Context/CollapseContext";

const Header = () => {
  const [username, setUsername] = useState(null);
  const { isCollapsed, toggleCollapse } = useContext(CollapseContext);
  const [openSubMenus, setOpenSubMenus] = useState({
    expenses: false,
    menu: false,
    penalties: false,
    structure: false,
    eDetail: false,
  });

  const toggleSubMenu = (menuName) => {
    setOpenSubMenus((prevState) => ({
      ...prevState,
      [menuName]: !prevState[menuName],
    }));
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData"));
    setUsername(storedUser?.username || "");
  }, []);

  return (
    <nav className={`${isCollapsed ? style.headerCollapsed : style.header}`}>
      <div>
        <div className={style.mobdesk}>
          <h2 className={isCollapsed ? style.collapsedTitle : ""}>
            <span className={isCollapsed ? style.collapsedM : ""}>M</span>
            {isCollapsed ? "" : "ASHA"}
          </h2>
        </div>
        <div
          className={`${style.nav} ${isCollapsed ? style.navCollapsed : ""}`}
        >
          <ul className={style.navigation}>
            <li className={isCollapsed ? style.navItemCollapsed : ""}>
              <Link to="/">
                <HomeBtn />
                {!isCollapsed && "Home"}
              </Link>
            </li>
            <li className={isCollapsed ? style.navItemCollapsed : ""}>
              <Link to="/candidates">
                <CandidatesBtn />
                {!isCollapsed && "Candidates"}
              </Link>
            </li>
            <li className={isCollapsed ? style.navItemCollapsed : ""}>
              <Link to="/orders">
                <OrdersBtn />
                {!isCollapsed && "Orders"}
              </Link>
            </li>
            <li className={isCollapsed ? style.navItemCollapsed : ""}>
              <div>
                <Link to="/employeeDetails">
                  <ExployeeDet />
                  {!isCollapsed && "Employee Detail"}
                </Link>
                {!isCollapsed && (
                  <span onClick={() => toggleSubMenu("eDetail")}>
                    {openSubMenus.eDetail ? "-" : "+"}
                  </span>
                )}
              </div>
              {!isCollapsed && openSubMenus.eDetail && (
                <ul className={`${style.subMenu} ${style.open}`}>
                  <li>
                    <Link to="/roles">Roles</Link>
                  </li>
                </ul>
              )}
            </li>
            <li className={isCollapsed ? style.navItemCollapsed : ""}>
              <div>
                <Link to="/menu">
                  <MenuIcon />
                  {!isCollapsed && <p>Menu</p>}
                </Link>
                {!isCollapsed && (
                  <span onClick={() => toggleSubMenu("menu")}>
                    {openSubMenus.menu ? "-" : "+"}
                  </span>
                )}
              </div>
              {!isCollapsed && openSubMenus.menu && (
                <ul className={`${style.subMenu} ${style.open}`}>
                  <li>
                    <Link to="/menu-category">Category</Link>
                  </li>
                </ul>
              )}
            </li>
            <li className={isCollapsed ? style.navItemCollapsed : ""}>
              <div>
                <Link to="#">
                  <DragIndicatorIcon />
                  {!isCollapsed && <p>Structure</p>}
                </Link>
                {!isCollapsed && (
                  <span onClick={() => toggleSubMenu("structure")}>
                    {openSubMenus.structure ? "-" : "+"}
                  </span>
                )}
              </div>
              {!isCollapsed && openSubMenus.structure && (
                <ul className={`${style.subMenu} ${style.open}`}>
                  <li>
                    <Link to="/rooms">Rooms</Link>
                  </li>
                  <li>
                    <Link to="/tables">Tables</Link>
                  </li>
                </ul>
              )}
            </li>

            <li className={isCollapsed ? style.navItemCollapsed : ""}>
              <div>
                <Link to="/expenses">
                  <ExpensesBtn />
                  {!isCollapsed && <p>Expenses</p>}
                </Link>
                {!isCollapsed && (
                  <span onClick={() => toggleSubMenu("expenses")}>
                    {openSubMenus.expenses ? "-" : "+"}
                  </span>
                )}
              </div>
              {!isCollapsed && openSubMenus.expenses && (
                <ul className={`${style.subMenu} ${style.open}`}>
                  <li>
                    <Link to="/expensesGroup">Category</Link>
                  </li>
                  <li>
                    <Link to="/allInnerGroupExpense">SubCategory</Link>
                  </li>
                  <li>
                    <Link to="/itemExpense">Item</Link>
                  </li>
                  <li>
                    <Link to="/SupplierExpense">Supplier</Link>
                  </li>
                  <li>
                    <Link to="/unit">Unit</Link>
                  </li>
                </ul>
              )}
            </li>
            <li className={isCollapsed ? style.navItemCollapsed : ""}>
              <Link to="/storage">
                <WarehouseIcon />
                {!isCollapsed && "Storage"}
              </Link>
            </li>
            <li className={isCollapsed ? style.navItemCollapsed : ""}>
              <Link to="/messageTemplate">
                <MessagesBtn />
                {!isCollapsed && "Messages"}
              </Link>
            </li>
            <li className={isCollapsed ? style.navItemCollapsed : ""}>
              <Link to="/items">
                <ItemsBtn />
                {!isCollapsed && "Items"}
              </Link>
            </li>

            <li className={isCollapsed ? style.navItemCollapsed : ""}>
              <Link to="/report">
                <ReportBtn />
                {!isCollapsed && "Report"}
              </Link>
            </li>
            <li className={isCollapsed ? style.navItemCollapsed : ""}>
              <Link to="/allmessages">
                <MessagesBtn />
                {!isCollapsed && "All Messages"}
              </Link>
            </li>
            <li className={isCollapsed ? style.navItemCollapsed : ""}>
              <div>
                <Link to="/allPenalties">
                  <ExployeeDet />
                  {!isCollapsed && <p>Penalties</p>}
                </Link>
                {!isCollapsed && (
                  <span onClick={() => toggleSubMenu("penalties")}>
                    {openSubMenus.penalties ? "-" : "+"}
                  </span>
                )}
              </div>
              {!isCollapsed && openSubMenus.penalties && (
                <ul className={`${style.subMenu} ${style.open}`}>
                  <li>
                    <Link to="/waiters">Crew</Link>
                  </li>
                </ul>
              )}
            </li>
          </ul>
          <div className={style.userLog}>
            {username ? (
              <AuthnComponent className={style.logOutBtn} />
            ) : (
              <Link to="/login">
                <button className={style.logBtn}>
                  <LogBtn />
                </button>
              </Link>
            )}
          </div>
          <span className={style.headerDecreaser} onClick={toggleCollapse}>
            <Decreaser />
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Header;
