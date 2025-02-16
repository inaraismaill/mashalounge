import { useState, useEffect, useRef } from "react";
import {
  Button,
  Typography,
  Chip,
  List,
  ListItem,
  Snackbar,
  Alert,
} from "@mui/material";
import { OrderItemService } from "../services/orderItemService.js";
import { onMessage } from "firebase/messaging";
import { messaging } from "../firebase.js";

const Department = () => {
  const orderItemService = new OrderItemService();
  const [notification, setNotification] = useState(null);

  const [tasks, setTasks] = useState([]);
  const [statusCounts, setStatusCounts] = useState({
    NEW: 0,
    IN_PROGRESS: 0,
    READY: 0,
  });
  const [selectedStatus, setSelectedStatus] = useState("NEW");

  const userData = JSON.parse(localStorage.getItem("userData")) || null;
  const prevTasksRef = useRef();
  const fetchTasks = async () => {
    try {
      const response = await orderItemService.getAll({
        foodDepartment: userData.positionName.toUpperCase(),
      });

      const allItems = response.data
        .flatMap((order) => order.items)
        .sort((a, b) => a.id - b.id);

      setTasks(allItems);
      updateStatusCounts(allItems);

      if (
        prevTasksRef.current &&
        JSON.stringify(prevTasksRef.current) !== JSON.stringify(allItems)
      ) {
        onMessage(messaging, (payload) => {
          console.log("Yeni bildirim alındı:", payload);
        });
      }
      prevTasksRef.current = allItems;
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const updateStatusCounts = (items) => {
    const counts = { NEW: 0, IN_PROGRESS: 0, READY: 0 };
    items.forEach((item) => {
      if (counts[item.status] !== undefined) counts[item.status]++;
    });
    setStatusCounts(counts);
  };

  const handleTaskStatusChange = async (taskId, status) => {
    try {
      await orderItemService.update(taskId, { status });
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, status } : task
      );
      setTasks(updatedTasks);
      updateStatusCounts(updatedTasks);
      fetchTasks();
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const filteredTasks = tasks.filter((task) => task.status === selectedStatus);
  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Yeni bildirim alındı:", payload);

      if (
        prevTasksRef.current &&
        JSON.stringify(prevTasksRef.current) !== JSON.stringify(tasks)
      ) {
        setNotification("Yeni bir sipariş var!");
      }
    });

    return () => unsubscribe();
  }, [tasks]); 
  useEffect(() => {
    fetchTasks();
  }, []);
  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.205)",
        }}
      >
        <Typography
          variant="h4"
          color="error"
          style={{ padding: "10px 0 15px", fontWeight: 900 }}
        >
          Masha Lounge /{" "}
          {userData.positionName.charAt(0).toUpperCase() +
            userData.positionName.slice(1).toLowerCase()}
        </Typography>
        {filteredTasks.length === 0 ? (
          <Typography
            variant="h6"
            color="textSecondary"
            style={{ marginTop: "20px" }}
          >
            Sifariş yoxdur
          </Typography>
        ) : (
          <List style={{ padding: 0 }}>
            {filteredTasks.map((task) => (
              <ListItem
                key={task.id}
                style={{
                  backgroundColor: "#25857de0",
                  marginBottom: "10px",
                  borderRadius: "10px",
                  padding: "10px",
                  display: "flex",
                  width: "100%",
                  color: "white",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{`Name : ${task.name}  /  Count : ${task.quantity}`}</span>
                <div>
                  {task.status === "NEW" && (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() =>
                        handleTaskStatusChange(task.id, "IN_PROGRESS")
                      }
                      style={{ marginLeft: "10px" }}
                    >
                      Accept
                    </Button>
                  )}
                  {task.status === "IN_PROGRESS" && (
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleTaskStatusChange(task.id, "READY")}
                      style={{ marginLeft: "10px" }}
                    >
                      Done
                    </Button>
                  )}
                </div>
              </ListItem>
            ))}
          </List>
        )}
        <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
          {["NEW", "IN_PROGRESS"].map((status) => (
            <Chip
              key={status}
              label={`${status === "NEW" ? "🆕" : "✅"} ${status}: ${
                statusCounts[status]
              }`}
              clickable
              color={selectedStatus === status ? "primary" : "default"}
              onClick={() => setSelectedStatus(status)}
              style={{ cursor: "pointer" }}
            />
          ))}
        </div>
      </div>
      <Snackbar
        open={Boolean(notification)}
        autoHideDuration={4000}
        onClose={() => setNotification(null)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="info" onClose={() => setNotification(null)}>
          {notification}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Department;
