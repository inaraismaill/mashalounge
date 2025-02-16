import React, { useState, useEffect } from "react";
import { OrderService } from "../services/orderService";
import { Link, useNavigate } from "react-router-dom";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
} from "@mui/material";
import style from "../styles/OrderList/OrderList.module.css";
import EmployeeIcon from "../assets/svg/EmployeeIcon";
import FilterIcon from "../assets/svg/Filterİcon";

function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);
  const [count, setCount] = useState(0);
  const [filteredCount, setFilteredCount] = useState(0);
  const navigate = useNavigate();
  const [clickedButton, setClickedButton] = useState(false);
  const [isEarly, setIsEarly] = useState(false);
  const [ignoreOrder, setIgnoreOrder] = useState({});

  useEffect(() => {
    const orderService = new OrderService();
    setLoading(true);
    if (clickedButton) {
      orderService
        .findByOpenCheckAtIsNotNullOrderByOpenCheck(pageNumber, isEarly)
        .then((res) => {
          setOrders(res.data.data);
          setFilteredCount(res.data.data.length);
          setLoading(false);
        })
        .catch((e) => {
          navigate("/login");
        });
    } else {
      orderService
        .findByOpenCheckAtIsNullOrderByOpenCheck(pageNumber, isEarly)
        .then((res) => {
          setOrders(res.data.data);
          setFilteredCount(res.data.data.length);
          setLoading(false);
        })
        .catch((e) => {
          navigate("/login");
        });
    }
  }, [pageNumber, clickedButton, isEarly, ignoreOrder]);

  useEffect(() => {
    const orderService = new OrderService();
    orderService.getCount().then((res) => {
      setCount(res.data);
    });
  }, []);

  const handleOrderTypeChange = (event) => {
    setClickedButton(event.target.value === "Closed");
  };

  const handleSortOrderChange = (event) => {
    setIsEarly(event.target.value === "Earliest");
  };

  const updateIsIgnore = (id) => {
    const orderService = new OrderService();
    const data = { id };
    orderService.updateIsIgnoreToTrue(data).then((res) => {
      setIgnoreOrder(res.data);
    });
  };

  const handleAddCandidate = (orderId) => {
    navigate(`/candidateItms/${orderId}`);
  };

  return (
    <div>
      <Typography className={style.title} variant="h4">
        Orders List
      </Typography>
      <Box
        className={style.filterBox}
        sx={{ display: "flex", gap: "10px", mb: 2 }}
      >
        <Typography
          className={style.showingInfo}
          variant="subtitle1"
          sx={{ mb: 2 }}
        >
          Showing {filteredCount} of {count} orders
        </Typography>
        <div className={style.filters}>
          <FilterIcon className={style.filterIcon} />
          <FormControl
            className={style.filter}
            sx={{
              minWidth: 150,
              zIndex: 1,
              ".MuiSelect-select": {
                borderRadius: "20px",
                border: "none",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "1px solid rgba(128, 128, 128, 0.534)",
                borderRadius: "20px",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                border: "1px solid rgba(128, 128, 128, 0.534)",
              },
            }}
          >
            <InputLabel id="order-type-label">Order Status</InputLabel>
            <Select
              labelId="order-type-label"
              value={clickedButton ? "Closed" : "Open"}
              label="Order Type"
              onChange={handleOrderTypeChange}
            >
              <MenuItem value="Open">Open orders</MenuItem>
              <MenuItem value="Closed">Closed orders</MenuItem>
            </Select>
          </FormControl>
          <FormControl
            sx={{
              minWidth: 150,
              zIndex: 1,
              ".MuiSelect-select": {
                borderRadius: "20px",
                border: "none",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "1px solid rgba(128, 128, 128, 0.534)",
                borderRadius: "20px",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                border: "1px solid rgba(128, 128, 128, 0.534)",
              },
            }}
          >
            <InputLabel id="sort-order-label">Sort Order</InputLabel>
            <Select
              labelId="sort-order-label"
              value={isEarly ? "Earliest" : "Latest"}
              label="Sort Order"
              onChange={handleSortOrderChange}
            >
              <MenuItem value="Earliest">Earliest</MenuItem>
              <MenuItem value="Latest">Latest</MenuItem>
            </Select>
          </FormControl>
        </div>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} className={style.tableContainer}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Document Number</TableCell>
                <TableCell>Table Name</TableCell>
                <TableCell>Hall</TableCell>
                <TableCell>Employee Name</TableCell>
                <TableCell>Open Check At</TableCell>
                <TableCell>Close Check At</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Count of Candidates</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order, i) => (
                <TableRow key={order.id}>
                  <TableCell>{i + 1 + 10 * pageNumber}</TableCell>
                  <TableCell>
                    <Link to={`/candidateItms/${order.id}`}>
                      {order.docNumber}
                    </Link>
                  </TableCell>
                  <TableCell>{order.tableName}</TableCell>
                  <TableCell>{order.hallName}</TableCell>
                  <TableCell className={style.employeeName}>
                    <EmployeeIcon />
                    {order.employeeName}
                  </TableCell>
                  <TableCell>{order.openCheckAt}</TableCell>
                  <TableCell>{order.closeCheckAt}</TableCell>
                  <TableCell>{order.amount}</TableCell>
                  <TableCell>{order.countCandidates || "?"}</TableCell>
                  <TableCell sx={{ display: "flex", flexDirection: "column" }}>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => updateIsIgnore(order.id)}
                      sx={{ marginBottom: "5px" }}
                    >
                      Ignore
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleAddCandidate(order.id)}
                    >
                      Add Candidate
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}

export default OrdersList;
