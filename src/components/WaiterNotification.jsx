import { useState, useEffect } from "react";
import { Button, Typography, Chip, List, ListItem } from "@mui/material";
import { OrderItemService } from "../services/orderItemService";

const WaiterNotification = () => {
  const orderItemService = new OrderItemService();
  const [tasks, setTasks] = useState([]);
  const [statusCounts, setStatusCounts] = useState({
    READY: 0,
    ACCEPTED: 0,
    DELIVERED: 0,
  });

  const [selectedStatus, setSelectedStatus] = useState(
    "READY",
    "ACCEPTED",
    "DELIVERED"
  );

  const userData = JSON.parse(localStorage.getItem("userData")) || null;

  useEffect(() => {
    if (userData && userData.employeeId) {
      fetchTasks();
    }
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await orderItemService.getAllWaiter(
        Number(userData.employeeId)
      );
      const allItems = response.data.data.flatMap((order) => order.items);


      setTasks(allItems);
      updateStatusCounts(allItems);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const updateStatusCounts = (items) => {
    const counts = {
      READY: 0,
      ACCEPTED: 0,
      DELIVERED: 0,
    };

    items.forEach((item) => {
      if (counts[item.status] !== undefined) {
        counts[item.status]++;
      }
    });

    setStatusCounts(counts);
  };

  const handleTaskStatusChange = async (taskId, status) => {
    try {
      const updatedStatusData = { status };

      await orderItemService.updateWaiter(taskId, updatedStatusData);

      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, status: status } : task
      );
      setTasks(updatedTasks);
      updateStatusCounts(updatedTasks);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const filteredTasks = tasks.filter((task) => task.status === selectedStatus);

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
          Masha Lounge / Waiter
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
                <span>{`${task.name} / ${task.menuName}`}</span>
                <div>
                  {task.status === "READY" && (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() =>
                        handleTaskStatusChange(task.id, "ACCEPTED")
                      }
                      style={{ marginLeft: "10px" }}
                    >
                      Accept
                    </Button>
                  )}
                  {task.status === "ACCEPTED" && (
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() =>
                        handleTaskStatusChange(task.id, "DELIVERED")
                      }
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
          {["READY", "ACCEPTED"].map((status) => (
            <Chip
              key={status}
              label={`${
                status === "READY" ? "🆕" : status === "ACCEPTED" ? "⏳" : "✅"
              } ${status}: ${statusCounts[status]}`}
              clickable
              color={selectedStatus === status ? "primary" : "default"}
              onClick={() => setSelectedStatus(status)}
              style={{ cursor: "pointer" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WaiterNotification;
