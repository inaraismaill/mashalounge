import MessageIcon from "@mui/icons-material/Message";
import styles from "../styles/Waiters/WaiterOrder.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { TablesService } from "../services/tablesService";
import { useDispatch } from "react-redux";
import { addOrderId, addTime, selectTable } from "../app/features/orderSlice";
import { OrderItemService } from "../services/orderItemService";

const WaiterOrder = () => {
  const orderItemService = new OrderItemService();
  const tableService = new TablesService();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [rooms, setRooms] = useState([]);
  const [itemCount, setItemCount] = useState(0);
  const [waiterName, setWaiterName] = useState("");

  const userData = JSON.parse(localStorage.getItem("userData"));

  const fetchTables = async () => {
    try {
      const response = await tableService.getAll();
      if (response.status === 200 || response.status === 201) {
        if (Array.isArray(response.data.data)) {
          const groupedRooms = response.data.data.reduce((acc, table) => {
            const room = acc.find((r) => r.roomName === table.roomName);
            if (room) {
              room.tables.push(table);
            } else {
              acc.push({
                roomName: table.roomName,
                roomNumber: table.roomId,
                tables: [table],
              });
            }
            return acc;
          }, []);
          setRooms(groupedRooms);
        } else {
          alert("Expected data to be an array:", response);
        }
      } else {
        alert("Error response:", response);
      }
    } catch (error) {
      navigate("/login");
      alert("Error fetching tables:", error);
    }
  };

  const getitemNumber = async () => {
    try {
      const response = await orderItemService.getAllWaiter(
        Number(userData.employeeId)
      );
      const newCount = response.data.data.flatMap(
        (order) => order.items
      ).length;
      setItemCount(newCount);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTables();
    getitemNumber();
    if (userData && userData.name) {
      setWaiterName(userData.name);
    }
  }, []);


  const handleTableClick = (tableId, tableName, orderId) => {
    dispatch(
      addTime({
        time: new Date().toLocaleTimeString("en-US", {
          timeZone: "Asia/Baku",
        }),
      })
    );
    dispatch(selectTable({ tableId, tableName }));
    dispatch(addOrderId({ orderId }));
    navigate("/order");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>Masha Lounch</div>
      <div className={styles.roomsContainer}>
        {rooms.map((room) => (
          <div key={room.roomNumber} className={styles.room}>
            <h2 className={styles.roomTitle}>{room.roomName}</h2>
            <div className={styles.tablesGrid}>
              {room.tables.map((table, index) => {
                const isOccupied = table.order !== null;
                return (
                  <div
                    key={index}
                    className={`${styles.table} ${
                      isOccupied ? styles.occupied : styles.available
                    }`}
                    onClick={() =>
                      handleTableClick(
                        table?.id,
                        table?.name,
                        table?.order?.id || ""
                      )
                    }
                  >
                    {isOccupied ? (
                      <>
                        <p className={styles.tableInfo}>{table.name}</p>
                        <p className={styles.tableInfo}>
                          Total Count: {table.order.amount}
                        </p>
                        <p className={styles.tableInfo}>
                          Time {table.order.time}
                        </p>
                      </>
                    ) : (
                      <p className={styles.tableInfo}>{table.name}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <p className={styles.footerText}>Waiter: {waiterName}</p>
        <div
          onClick={() => navigate("/waiter-notification")}
          className={styles.footerIcon}
        >
          <MessageIcon />
          {itemCount > 0 && (
            <span className={styles.notificationCount}>{itemCount}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaiterOrder;
