import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ItemService } from "../services/itemService";
import { PaymentService } from "../services/paymentService";
import { OrderService } from "../services/orderService";

function ListItems() {
  const [datas, setDatas] = useState([]);
  const [order, setOrder] = useState({});
  const [payments, setPayments] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const { id } = useParams();
  const [totalPrices, setTotalPrices] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const itemService = new ItemService();

    itemService
      .findByOrderId(id, pageNumber)
      .then((res) => setDatas(res.data.data))
      .catch(() => navigate("/login"));
  }, [pageNumber]);

  useEffect(() => {
    const orderService = new OrderService();

    orderService
      .findOrderWithoutCandidateDtoById(id)
      .then((res) => setOrder(res.data.data));

    const itemsService = new ItemService();
    itemsService
      .getSumPricesByOrderId(id)
      .then((res) => setTotalPrices(res.data));

    const paymentService = new PaymentService();

    paymentService.findByOrderId(id).then((res) => setPayments(res.data.data));
  }, []);

  return (
    <div>
      <h2>Order</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Document Number</th>
            <th>Table Name</th>
            <th>Employee Name</th>
            <th>Open Check At</th>
            <th>Close Check At</th>
            <th>Amount</th>
            <th>Count of Candidates</th>
          </tr>
        </thead>
        <tbody>
          <tr key={order.id}>
            <td>{order.docNumber}</td>
            <td>{order.tableName}</td>
            <td>{order.employeeName}</td>
            <td>{order.openCheckAt}</td>
            <td>
              {order.closeCheckAt ? order.closeCheckAt : "The check is open"}
            </td>
            <td>{order.amount ? order.amount : 0}</td>
            <td>{order.countCandidates ? order.countCandidates : "?"}</td>
          </tr>
        </tbody>
      </table>
      <h2>Items</h2>
      {datas ? (
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Item name</th>
                <th>Item serial</th>
                <th>Item amount</th>
                <th>Item sum price</th>
                <th>Item price</th>
                <th>Item status</th>
                <th>Item quantity</th>
              </tr>
            </thead>
            <tbody>
              {datas.map((data, i) => (
                <tr key={data.id}>
                  <td>{i + 1 + 10 * pageNumber}</td>
                  <td>{data.item.itemName}</td>
                  <td>{data.item.itemSerial}</td>
                  <td>{data.itemAmount}</td>
                  <td>{data.itemSumPR}</td>
                  <td>{data.itemPrice}</td>
                  <td>{data.itemStatus}</td>
                  <td>{data.itemQty}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>Total price: {totalPrices}</tfoot>
          </table>

          <nav aria-label="Page navigation">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${pageNumber === 0 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setPageNumber(pageNumber - 1)}
                >
                  Previous
                </button>
              </li>
              <li
                className={`page-item ${
                  (pageNumber + 1) * 10 > datas.length ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => setPageNumber(pageNumber + 1)}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
          <h2>Payment</h2>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Cesh amount</th>
                <th>Ceshless amount</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, i) => (
                <tr key={payment.id}>
                  <td>{i + 1}</td>
                  <td>{payment.cashAmount}</td>
                  <td>{payment.cashlessAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <h2>No items, the check is not closed</h2>
      )}
    </div>
  );
}

export default ListItems;
