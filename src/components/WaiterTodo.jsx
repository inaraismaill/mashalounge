
import styles from "../styles/Waiters/WaiterTodo.module.css";

const sampleData = [
  {
    id: 1,
    department: "Kitchen",
    productName: "Pizza Margherita",
    orderTime: "12:08",
  },
  {
    id: 2,
    department: "Bar",
    productName: "Cappuccino, Latte",
    orderTime: "12:15",
  },
  {
    id: 3,
    department: "Kitchen",
    productName: "Caesar Salad",
    orderTime: "12:25",
  },
];
const officerName = "Eliyev Ilkin";

const departmentColors = {
  Kitchen: "#ffe0b2",
  Bar: "#b2ebf2",
};

const WaiterTodo = () => {
  const handleTaskCompletion = (taskId) => {
    alert(`Task with ID ${taskId} is marked as completed!`);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>{officerName}</header>
      <ul className={styles.taskList}>
        {sampleData.map((task) => (
          <li
            key={task.id}
            className={styles.taskItem}
            style={{ backgroundColor: departmentColors[task.department] || "#ffffff" }}
          >
            <div className={styles.taskInfo}>
              <p><strong>Department:</strong> {task.department}</p>
              <p><strong>Product:</strong> {task.productName}</p>
              <p><strong>Order Time:</strong> {task.orderTime}</p>
            </div>
            <button
              className={styles.completeButton}
              onClick={() => handleTaskCompletion(task.id)}
            >
              Confirm
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WaiterTodo;
