import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CollapseProvider } from "./Context/CollapseContext";
import Layout from "./Layout/Layout";
import CreateMessageTemplate from "./components/CreateMessageTemplate";
import Login from "./components/Login";
import AddOrder from "./components/AddOrder";
import OrdersList from "./components/OrdersList";
import Candidates from "./components/Candidates";
import CandidateDetalis from "./components/CandidateDetalis";
import ListItems from "./components/ListItems";
import AddCanididate from "./components/AddCandidate";
import ListCandidate from "./components/ListCandidate";
import CandidateInfo from "./components/CandidateInfo";
import NotFound from "./components/NotFound";
import Messages from "./components/Messages";
import Items from "./components/Items";
import FilterAndSendMessage from "./components/FilterAndSendMessage";
import CandidateMessageQueue from "./components/CandidateMessageQueue";
import GroupExpense from "./components/GroupExpense";
import InnerGroupExpense from "./components/InnerGroupExpense";
import Expense from "./components/Expense";
import EmployeeDetails from "./components/EmployeeDetails";
import Report from "./components/Report";
import SearchOrders from "./components/SearchOrders";
import AllInnerGroupExpense from "./components/AllInnerGroupExpense";
import ItemExpense from "./components/ItemExpense";
import AllMessages from "./components/AllMessages";
import SupplierExpense from "./components/SupplierExpense";
import FindByGroupId from "./components/FindByGroupId";
import FindByInnerGroupId from "./components/FindByInnerGroupId";
import FindByItemId from "./components/FindByItemId";
import Waiters from "./components/Waiters";
import WaiterPenalties from "./components/WaiterPenalties";
import AllPenalties from "./components/AllPenalties";
import ExpenseDetail from "./components/ExpenseDetail";
import Menucategory from "./components/MenuCategory";
import MenuList from "./components/MenuList";
import Rooms from "./components/Rooms";
import Tables from "./components/Tables";
import Storage from "./components/Storage";
import Unit from "./components/Unit";
import WaiterOrder from "./components/WaiterOrder";
import WaiterTodo from "./components/WaiterTodo";
import WaiterLogin from "./components/WaiterLogin";
import Department from "./components/Department";
import Order from "./components/Order";
import Roles from "./components/Roles";
import Candidate from "./components/Candidate";
import AddNewOrder from "./components/AddNewOrder";
import WaiterNotification from "./components/WaiterNotification";

const userData = JSON.parse(localStorage.getItem("userData")) || "undefined";
const rolesForDepartment = ["tea", "bar", "hookah", "kitchen", "set"];
function App() {
  return (
    <Router>
      <CollapseProvider>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                rolesForDepartment.includes(userData.positionName) ? (
                  <Department />
                ) : userData.positionName === "waiter" ? (
                  <WaiterOrder />
                ) : (
                  <OrdersList />
                )
              }
            />
            {(userData.positionName === null || userData.positionName === "admin") && (
              <>
                <Route path="/addCandidate" element={<AddCanididate />} />
                <Route path="/addOrder/:id" element={<AddOrder />} />
                <Route path="/candidates" element={<Candidates />} />
                <Route
                  path="/candidateDetalis/:id"
                  element={<CandidateDetalis />}
                />
                <Route path="/candidateItms/:id" element={<ListItems />} />
                <Route path="/listCanidates/:id" element={<ListCandidate />} />
                <Route path="/:id" element={<CandidateInfo />} />
                <Route path="/messageTemplate" element={<Messages />} />
                <Route path="/allmessages" element={<AllMessages />} />
                <Route path="/rooms" element={<Rooms />} />
                <Route path="/storage" element={<Storage />} />
                <Route path="/tables" element={<Tables />} />
                <Route
                  path="/createMessageTemplate"
                  element={<CreateMessageTemplate />}
                />
                <Route path="/unit" element={<Unit />} />
                <Route path="/orders" element={<SearchOrders />} />
                <Route path="/items" element={<Items />} />
                <Route
                  path="/filterAndSendMessage"
                  element={<FilterAndSendMessage />}
                />
                <Route
                  path="/candidateQueue/:id"
                  element={<CandidateMessageQueue />}
                />
                <Route path="/expensesGroup" element={<GroupExpense />} />
                <Route path="/SupplierExpense" element={<SupplierExpense />} />
                <Route
                  path="/expensesInnerGroup/:id"
                  element={<InnerGroupExpense />}
                />
                <Route path="/expenses" element={<Expense />} />
                <Route path="/expense-detail/:id" element={<ExpenseDetail />} />
                <Route path="/employeeDetails" element={<EmployeeDetails />} />
                <Route path="/report" element={<Report />} />
                <Route
                  path="/allInnerGroupExpense"
                  element={<AllInnerGroupExpense />}
                />
                <Route
                  path="/findByItemId/:itemId"
                  element={<FindByItemId />}
                />
                <Route
                  path="/findByGroup/:groupId"
                  element={<FindByGroupId />}
                />
                <Route
                  path="/findByInnerGroup/:innerGroupId"
                  element={<FindByInnerGroupId />}
                />
                <Route path="/itemExpense" element={<ItemExpense />} />
                <Route path="/waiters" element={<Waiters />} />
                <Route path="/allPenalties" element={<AllPenalties />} />
                <Route
                  path="/waiter-details/:waiterId"
                  element={<WaiterPenalties />}
                />
                <Route path="/menu" element={<MenuList />} />
                <Route path="/menu-category" element={<Menucategory />} />
                <Route path="/roles" element={<Roles />} />
              </>
            )}

            {userData.positionName == "waiter" && (
              <>
                <Route path="/waiter-notification" element={<WaiterNotification />} />
                <Route path="/waiter-order" element={<WaiterOrder />} />
                <Route path="/waiter-login" element={<WaiterLogin />} />
                <Route path="/waiter-todo" element={<WaiterTodo />} />
                <Route path="/add-candidate" element={<Candidate />} />
                <Route path="/order" element={<Order />} />
                <Route path="/addneworder" element={<AddNewOrder />} />
              </>
            )}

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </CollapseProvider>
    </Router>
  );
}

export default App;
