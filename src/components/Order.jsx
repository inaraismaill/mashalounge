import { useNavigate } from "react-router-dom";
import styles from "../styles/OrderList/Order.module.css";
import StarIcon from "@mui/icons-material/Star";
import AddIcon from "@mui/icons-material/Add";
import { useSelector, useDispatch } from "react-redux";
import { addOrderItem, resetOrder } from "../app/features/orderSlice";
import { OrderService } from "../services/orderService";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useState } from "react";
import { Button } from "antd";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const Order = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const orderService = new OrderService();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    tableId,
    candidateId,
    tableName,
    candidateName,
    menuList,
    count,
    time,
    orderId,
    totalCount,
  } = useSelector((state) => state.order);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const waiterId = userData?.employeeId || 0;

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await orderService.getOrderById(orderId);
  

      if (response.status === 200 || response.status === 201) {
        const { menuList } = response.data.data;
        let allCount = 0;

        const updatedMenuList = menuList.map((menu) => {
          allCount += menu.price * menu.quantity;
  
          return {
            id: menu.id,
            name: menu.name,
            quantity: menu.quantity,
            price: menu.price,
          }})
  
        dispatch(addOrderItem({ menuList: updatedMenuList, totalCount: allCount }));
      }
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    }
  };


  useEffect(() => {
    if (orderId && typeof orderId === "number") {
      fetchOrderDetails(orderId);
    }
  }, [orderId]);

  const handleSaveOrder = async () => {
    try {
      const payload = {
        candidateId: candidateId || 0,
        count: count || 0,
        tableId: tableId || 0,
        waiterId,
        menuList: menuList[0].map((order) => ({
          id: order.id || 0,
          quantity: order.quantity || 0,
        })),
      };

      const response = await orderService.save(payload);

      if (response.status === 200 || response.status === 201) {
        toast.success("Order saved successfully!", { position: "top-left" });
        reset();
      } else {
        console.error(response);
        toast.error("Failed to save order.", { position: "top-left" });
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.message, { position: "top-left" });
    }
  };
  const handleCloseOrder = async () => {
    try {
      await orderService.close(orderId);
      toast.success("Order closed successfully!", { position: "top-left" });
      reset();
    } catch (error) {
      console.error(error);
      toast.error("Failed to close order.", { position: "top-left" });
    }
  };

  const reset = () => {
    navigate("/waiter-order");
    dispatch(resetOrder());
  };

  return (
    <div className={styles.orderContainer}>
      <div className={styles.paper}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <button className={styles.reset} onClick={() => reset()}>
            <ArrowBackIcon />
          </button>
          <h2 className={styles.header}>{tableName || "No Table"}</h2>
        </div>

        <div className={styles.orderList}>
          {menuList[0]?.map((order, index) => (
            <div key={index} className={styles.orderItem}> 
              <div className={styles.orderDetails}>
                <span>Name: {order.name}</span>
                <span style={{ fontSize: "14px" }}>
                  Count: {order.quantity}
                </span>
              </div>
              <span>${order.quantity * order.price}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.footerInfo}>
          <h3>Total Price: AZN {totalCount}</h3>
          <h3>Time : {time} </h3>
        </div>
        <div className={styles.grid}>
          <div
            className={styles.gridItem}
            onClick={() => {
              if (!candidateName) {
                navigate("/add-candidate");
              }
            }}
          >
            <span>{candidateName || "No Candidate"}</span>
          </div>
          <div className={styles.gridItem} onClick={() => setModalOpen(true)}>
            <StarIcon />
          </div>
          <div
            onClick={() => navigate("/addneworder")}
            className={styles.gridItem}
          >
            <AddIcon />
          </div>
        </div>
      </div>
      {modalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <Button
              className={styles.closeButton}
              onClick={() => setModalOpen(false)}
            >
              ×
            </Button>
            <br />
            <Button onClick={handleSaveOrder}>Tesdiqle</Button>
            <Button onClick={handleCloseOrder}>Bitir</Button>
          </div>
        </div>
      )}{" "}
      <ToastContainer />
    </div>
  );
};

export default Order;
